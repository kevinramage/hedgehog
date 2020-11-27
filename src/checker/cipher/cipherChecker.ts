import * as https from "https";
import { format } from "util";
import { IChecker } from "../IChecker";

/**
 * Checker to analyze communication between client and server.
 * Check the cipher allow by the server
 */
export class CipherChecker implements IChecker {

    private _host: string;
    private _port: number;

    /**
     * Constructor
     * @param host host to test
     * @param port port to test
     */
    constructor(host: string, port: number) {
        this._host = host;
        this._port = port;
    }

    /**
     * Run the execution of the checker
     */
    public async run() {

        const list : string[] = [];
        // list.push("AES_128_GCM");

        // console.info("Start cipher to analyze: " + list.length);
        const promises = list.map(c => { return this.runQuery(c); });
        await Promise.all(promises);
        // console.info("End cipher to analyze: " + list.length)
       /*
        const ciphers = "ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:AES128-GCM-SHA256:RC4:HIGH:!MD5:!aNULL";
        console.info("Ciphers: " + ciphers);
        await this.runQuery(ciphers);
        */
    }

    /**
     * Run an HTTP request with a specific cipher to test server
     * @param cipher cipher to check
     */
    private runQuery(cipher: string) {
        return new Promise<void>((resolve) => {
            let responseSent = false;
            const errorHandler = (err: any) => {
                if (!responseSent) {
                    responseSent = true;
                    // console.error(format("%s => KO (%s)", cipher, err.code));
                    if (err.code !== "ERR_SSL_NO_CIPHER_MATCH") {
                        //
                    }
                    resolve();
                }
            }
            const completeRequest = () => { /* console.info(format("%s => OK", cipher)); */ }
            const abortRequest = () => { /* console.info(format("%s => Timeout", cipher)); */ }
            try {
                let code = "";
                const options : https.RequestOptions = { hostname: this._host, port: this._port, path: "/", ciphers: cipher, timeout: 50000 };
                const request = https.request(options, (res) => {
                    res.on("error", errorHandler);
                    res.on("data", (chunk) => {
                        code += chunk;
                    });
                    res.on("end", () => { completeRequest(); });
                });
                request.on("error", errorHandler);
                request.on("abort", abortRequest);
                request.on("timeout", () => { request.abort(); });


                request.end("");
            } catch (err) {
                errorHandler(err);
            }
        });
    }

    public static fromArgs(content: string) {
        return null;
    }
}