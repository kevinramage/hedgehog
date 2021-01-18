import * as https from "https";
import { Report } from "../report/report";
import { CipherResult } from "./cipherResult";
import { REQUEST_METHODS } from "../request/request";
import { format } from "util";

import CIPHERS_SUITE = require("../../../config/connection/cipherSuite.json");

export class CipherListener {
    private _host : string;
    private _port : number;
    private _path : string;
    private _report ?: Report;
    private _results : CipherResult[];

    constructor(host: string, port: number, path: string, report ?: Report) {
        this._host = host;
        this._port = port;
        this._path = path;
        this._results = [];
        this._report = report;
    }

    public async run() {
        return new Promise<void>(async (resolve) => {

            // Collect ciphers
            const ciphersSuite = CIPHERS_SUITE as any[];

            // Print user request
            if (this._report) {
                this._report.writeRequest(this);
            }

            // Run checker
            const promises = ciphersSuite.map(c => { return this.runQuery(c.cipher, c.category); });
            this._results = await Promise.all(promises);

            // Update result status
            this._results.forEach(r => {
                r.status = r.isListening && (r.category === "Insecure" || r.category === "Weak") ? "INJECTED" : "NOT_INJECTED";
            });

            // Print summary
            if (this._report) {
                this._report.writeSummary(this);
            }

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
                        if (this._report) {
                            this._report.changeStep(format("%s(%s) => Error: %s", cipher, category, errorCode));
                        }
                        resolve(new CipherResult(cipher, category, true, errorCode));

                    } else {
                        if (errorCode === "ERR_SSL_NO_CIPHER_MATCH") {
                            if (this._report) {
                                this._report.changeStep(format("%s(%s) => Error: %s", cipher, category, errorCode));
                            }
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
                    if (this._report) {
                        this._report.changeStep(format("%s(%s) => Connected, status %d", cipher, category, response.statusCode));
                    }
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

    public get results() {
        return this._results;
    }
}