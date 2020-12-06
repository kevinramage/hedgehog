import { IChecker } from "../IChecker";
import * as https from "https";
import { REQUEST_METHODS } from "../../common/business/request/request";

import CIPHERS_SUITE = require("../../config/connection/cipherSuite.json");
import { CipherResult } from "./cipherResult";
import { format } from "util";
import { Report } from "../../common/business/report/report";
import { CipherReport } from "../../common/business/report/cipherReport";

/**
 * Checker to analyze communication between client and server.
 * Check the cipher allow by the server
 *
 * https://cheatsheetseries.owasp.org/cheatsheets/TLS_Cipher_String_Cheat_Sheet.html
 * https://ciphersuite.info/
 * https://tools.ietf.org/html/rfc5246#page-75
 */
export class CipherChecker implements IChecker {

    private _host: string;
    private _port: number;
    private _path : string;
    private _ciphersToTest : string[];
    private _results : CipherResult[];
    private _report : Report;

    /**
     * Constructor
     * @param host host to test
     * @param port port to test
     * @param path path to test
     */
    constructor(host: string, port: number, path: string) {
        this._host = host;
        this._port = port;
        this._path = path;
        this._ciphersToTest = [];
        this._results = [];
        this._report = new CipherReport();
    }

    /**
     * Run the execution of the checker
     */
    public async run() {
        return new Promise<void>(async (resolve) => {

            // Collect ciphers
            const ciphersSuite = CIPHERS_SUITE as any[];
            this._ciphersToTest = ciphersSuite.map(c => { return format("%s(%s)", c.cipher, c.category); })

            // Print user request
            this._report.writeRequest(this);

            // Run checker
            const promises = ciphersSuite.map(c => { return this.runQuery(c.cipher, c.category); });
            this._results = await Promise.all(promises);

            // Print summary
            this._report.writeSummary(this);

            resolve();
        });
    }

    private runQuery(cipher: string, category: string) {
        return new Promise<CipherResult>((resolve) => {

            // Prepare request
            const options : https.RequestOptions = {
                hostname: this._host,
                port: this._port,
                path: this._path,
                method: REQUEST_METHODS.CONNECT,
                ciphers: cipher
            };

            // Handler
            let responseProvided = false;
            const errorHandler = (err: any) => {
                if (!responseProvided) {
                    responseProvided = true;
                    const errorCode = (err.code) ? err.code : "NO ERROR CODE";
                    if (errorCode !== "ERR_SSL_NO_CIPHER_MATCH" && errorCode !== "ERR_SSL_NO_CIPHERS_AVAILABLE") {
                        this._report.changeStep(format("%s(%s) => Error: %s", cipher, category, errorCode));
                        resolve(new CipherResult(cipher, category, true, errorCode));

                    } else {
                        if (errorCode === "ERR_SSL_NO_CIPHER_MATCH") {
                            this._report.changeStep(format("%s(%s) => Error: %s", cipher, category, errorCode));
                        }
                        resolve(new CipherResult(cipher, category, false, errorCode));
                    }
                }
            };

            // Run request
            try {
                // Create request
                const req = https.request(options);

                // Connect
                req.on("connect", (response) => {
                    this._report.changeStep(format("%s(%s) => Connected, status %d", cipher, category, response.statusCode));
                    resolve(new CipherResult(cipher, category, true, ""));
                });

                // Error handling
                req.on("error", (errorHandler));

                // Send request
                req.end();

            } catch (err) {
                errorHandler(err);
            }
        });
    }

    public get host() {
        return this._host;
    }

    public get port() {
        return this._port;
    }

    public get path() {
        return this._path;
    }

    public get ciphersToTest() {
        return this._ciphersToTest;
    }

    public get results() {
        return this._results;
    }

    public static fromArgs(content: string) {
        return null;
    }
}