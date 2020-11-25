import * as https from "https";
import { Result } from "../../common/business/result"
import { ResultItem } from "../../common/business/resultItem";
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
        const instance = this;
        var sendResponse = false;
        return new Promise<SSLProtocolCheckItem>((resolve) => {

            // Create check item
            const checkItem = new SSLProtocolCheckItem();
            checkItem.SSLMethod = sslProtocol;

            // Request options
            const options : https.RequestOptions = {
                hostname: instance._host,
                port: instance._port,
                method: "GET",
                path: "/",
                secureProtocol: sslProtocol,
                rejectUnauthorized: false
            };

            // Create request
            var request;
            try {
                var code = "";
                request = https.request(options, (res) => {
                res.on("error", (err: any) => {
                    if ( !sendResponse ) {
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
                console.error(err.code);
                if ( !sendResponse ) {
                    sendResponse = true;
                    checkItem.status = CHECKITEM_STATUS.ERROR;
                    checkItem.errorMessage = err.code;
                    resolve(checkItem);
                }
            });

            
            } catch (err) {
                if ( err && err.code == "ERR_TLS_INVALID_PROTOCOL_METHOD" ) {
                    checkItem.status = CHECKITEM_STATUS.NOT_SUPPORTED;
                    resolve(checkItem);
                } else {
                    if ( !sendResponse ) {
                        sendResponse = true;
                        checkItem.status = CHECKITEM_STATUS.ERROR;
                        checkItem.errorMessage = err.code;
                        resolve(checkItem);
                    }
                }
            } 

            if ( request ) {
                request.end();
            }
        });
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

export class SSLProtocolCheckItem extends ResultItem {
    public SSLMethod: string;
    public status: string;

    constructor() {
        super();
        this.SSLMethod = "";
        this.status = "";
    }

    public static mergeProtocols(items: SSLProtocolCheckItem[]) {
        return items.filter(i => { return i.status == CHECKITEM_STATUS.SUPPORTED; })
            .map(i => { return i.SSLMethod; })
            .join(", ")
    }
}

export module CHECKITEM_STATUS {
    export const ERROR = "ERROR";
    export const SUPPORTED = "SUPPORTED";
    export const NOT_SUPPORTED = "NOT_SUPPORTED";
}

export module SSL_METHOD {
    export const SSLv3_server_method = "SSLv3_server_method";
    export const SSLv3_client_method = "SSLv3_client_method";
    export const SSLv3_method = "SSLv3_method";
    export const TLSv1_server_method = "TLSv1_server_method";
    export const TLSv1_client_method = "TLSv1_client_method";
    export const TLSv1_method = "TLSv1_method";
    export const TLSv1_1_server_method = "TLSv1_1_server_method";
    export const TLSv1_1_client_method = "TLSv1_1_client_method";
    export const TLSv1_1_method = "TLSv1_1_method";
    export const TLSv1_2_server_method = "TLSv1_2_server_method";
    export const TLSv1_2_client_method = "TLSv1_2_client_method";
    export const TLSv1_2_method = "TLSv1_2_method";
    export const TLS_server_method = "TLS_server_method";
    export const TLS_client_method = "TLS_client_method";
    export const TLS_method = "TLS_method";
}