import * as https from "https";
// import { Result } from "../../common/business/result"
// import { ResultItem } from "../../common/business/resultItem";
import { IChecker } from "../IChecker";

/**
 * Checker to test the SSL method allowed by the server
 */
export class SSLMethodChecker implements IChecker {

    public static NAME = "SSLProcolChecker";
    private _host : string;
    private _port : number;

    /**
     * Constructor
     * @param host host to test
     * @param port port to test
     */
    constructor(host: string, port: number) {
        this._host = host;
        this._port = port;
    }


    run(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /*
    run2() {
        const instance = this;

        // Prepare result
        const check = new SSLProtocolCheck();
        check.host = instance._host;
        check.port = instance._port;

        // Run query foreach SSL method
        return new Promise<SSLProtocolCheck>((resolve) => {
            Promise.all([
                instance.runQuery(SSL_METHOD.SSLv3_method),
                instance.runQuery(SSL_METHOD.TLSv1_method),
                instance.runQuery(SSL_METHOD.TLSv1_1_method),
                instance.runQuery(SSL_METHOD.TLSv1_2_method),
            ]).then((result) => {
                check.items = result;
                check.protocols = SSLProtocolCheckItem.mergeProtocols(result);
                resolve(check);
            }).catch((err) => {
                check.errorMessage = err;
                resolve(check);
            });
        });
    }
    */

    private runQuery(sslProtocol: string) {
        // let sendResponse = false;
        /*
        return new Promise<SSLProtocolCheckItem>((resolve) => {

            // Create check item
            const checkItem = new SSLProtocolCheckItem();
            checkItem.SSLMethod = sslProtocol;

            // Request options
            const options : https.RequestOptions = {
                hostname: this._host,
                port: this._port,
                method: "GET",
                path: "/",
                secureProtocol: sslProtocol,
                rejectUnauthorized: false
            };

            // Create request
            let request;
            try {
                let code = "";
                request = https.request(options, (res) => {
                res.on("error", (err: any) => {
                    if (!sendResponse) {
                        sendResponse = true;
                        checkItem.status = CHECKITEM_STATUS.ERROR;
                        checkItem.errorMessage = err.code;
                        resolve(checkItem);
                    }
                });
                res.on("data", (chunk) => {
                    code += chunk;
                });
                res.on("end", () => {
                    checkItem.status = CHECKITEM_STATUS.SUPPORTED;
                    resolve(checkItem);
                });
            });

            request.on("error", (err: any) => {
                // console.error(err.code);
                if (!sendResponse) {
                    sendResponse = true;
                    checkItem.status = CHECKITEM_STATUS.ERROR;
                    checkItem.errorMessage = err.code;
                    resolve(checkItem);
                }
            });


            } catch (err) {
                if (err && err.code === "ERR_TLS_INVALID_PROTOCOL_METHOD") {
                    checkItem.status = CHECKITEM_STATUS.NOT_SUPPORTED;
                    resolve(checkItem);
                } else {
                    if (!sendResponse) {
                        sendResponse = true;
                        checkItem.status = CHECKITEM_STATUS.ERROR;
                        checkItem.errorMessage = err.code;
                        resolve(checkItem);
                    }
                }
            }

            if (request) {
                request.end();
            }
        });
        */
    }

    public static fromArgs(content: string) {
        return null;
    }
}

/*
export class SSLProtocolCheck extends Result {
    public host: string;
    public port: number;
    public protocols: string;

    constructor() {
        super(SSLProcolChecker.NAME);
        this.host = "";
        this.port = -1;
        this.protocols = "";
    }
}
*/

/*
export class SSLProtocolCheckItem extends ResultItem {
    public SSLMethod: string;
    public status: string;

    constructor() {
        super();
        this.SSLMethod = "";
        this.status = "";
    }

    public static mergeProtocols(items: SSLProtocolCheckItem[]) {
        return items.filter(i => { return i.status === CHECKITEM_STATUS.SUPPORTED; })
            .map(i => { return i.SSLMethod; })
            .join(", ")
    }
}

export enum CHECKITEM_STATUS {
    ERROR = "ERROR",
    SUPPORTED = "SUPPORTED",
    NOT_SUPPORTED = "NOT_SUPPORTED"
}

export enum SSL_METHOD {
    SSLV3 = "SSLv3_method",
    TLSV1 = "TLSv1_method",
    TLSV1_1 = "TLSv1_1_method",
    TLSV1_2 = "TLSv1_2_method",
}
*/