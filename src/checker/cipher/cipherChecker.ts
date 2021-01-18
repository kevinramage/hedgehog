import { IChecker } from "../IChecker";
import { CipherResult } from "../../common/business/checker/cipherResult";
import { CipherReport } from "../../common/business/report/cipherReport";
import { CipherListener } from "../../common/business/checker/cipherListener";

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
    private _path: string;
    private _results : CipherResult[];

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
        this._results = [];
    }

    /**
     * Run the execution of the checker
     */
    public async run() {
        return new Promise<void>(async (resolve) => {

            // Run cipher listener
            const cipherListener = new CipherListener(this._host, this._port, this._path, new CipherReport());
            await cipherListener.run();

            // Collect results
            this._results = cipherListener.results;

            resolve();
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

    public get results() {
        return this._results;
    }

    public static fromArgs(content: string) {
        return null;
    }
}