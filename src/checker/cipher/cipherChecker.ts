import { resolve } from "path";
import { IChecker } from "../IChecker";

// Implement ClientHello avec une liste de cipher élévé
// Analyse the ServerHello message
// https://github.com/kuisathaverat/TestSSLServer

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
        return new Promise<void>(async (r) => {
            // console.info(tls.getCiphers());
            const ciphersSuite = ["TLS_RSA_WITH_AES_128_CBC_SHA"];
            const promises = ciphersSuite.map(c => { return this.runQuery(c); });
            await Promise.all(promises);
            r();
        });
    }

    private runQuery(cipher: string) {
        return new Promise<void>(() => {
            /*
            const options : https.RequestOptions = {
                hostname: this._host,
                //port: this._port,
                method: "CONNECT",
                ciphers: cipher.toUpperCase(),
                rejectUnauthorized: false
            };

            let request;
            try {
                request = https.request(options);
                request.on("connect", () => {
                    console.info("connect");
                    resolve();
                });

                request.on("error", (err: any) => {
                    if ( err.code === "ERR_SSL_NO_CIPHERS_AVAILABLE" ) {
                        console.info("error: " + err.code);

                    } else {
                        console.info("error: " + err.code);
                    }
                    resolve();
                });

            } catch (err) {
                if (err.code == "ERR_SSL_NO_CIPHER_MATCH") {

                }
                console.info("error ..." + err.code);
                resolve();
            }

            if (request) {
                request.end();
            }
            */
           resolve();
        });
    }

    public static fromArgs(content: string) {
        return null;
    }
}