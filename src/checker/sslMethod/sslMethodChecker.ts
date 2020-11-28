import * as https from "https";
import { IChecker } from "../IChecker";
import { SSLMethodResult } from "./sslMethodResult";
import * as winston from "winston";
import { Report } from "../../common/business/report/report";
import { SSLReport } from "../../common/business/report/sslReport";
import * as tls from "tls";
import { format } from "util";

/**
 * Checker to test the SSL method allowed by the server
 */
export class SSLMethodChecker implements IChecker {

    public static NAME = "SSLProcolChecker";
    private _host : string;
    private _port : number;
    private _report : Report;
    private _results : SSLMethodResult[];

    /**
     * Constructor
     * @param host host to test
     * @param port port to test
     */
    constructor(host: string, port: number) {
        this._host = host;
        this._port = port;
        this._report = new SSLReport();
        this._results = [];
    }


    public run(): Promise<void> {
        winston.debug("SSLMethodChecker.run");
        return new Promise<void>(async (resolve) => {
            this._report.writeRequest(this);
            const methods = [SSL_METHOD.SSLV3, SSL_METHOD.TLSV1, SSL_METHOD.TLSV1_1, SSL_METHOD.TLSV1_2, SSL_METHOD.TLSV1_3];
            const promises = methods.map(m => { return this.runQuery(m); });
            this._results = await Promise.all(promises);
            this._report.writeSummary(this);
            resolve();
        });
    }

    private runQuery(sslMethod: string) {
        winston.debug("SSLMethodChecker.runQuery");
        let sendResponse = false;
        return new Promise<SSLMethodResult>((resolve) => {

            // Request options
            const options : https.RequestOptions = {
                hostname: this._host,
                port: this._port,
                method: "CONNECT",
                rejectUnauthorized: false
            };

            if (sslMethod !== SSL_METHOD.TLSV1_3) {
                options.secureProtocol = sslMethod.replace(".", "_") + "_method";
            } else {
                options.minVersion = "TLSv1.3";
                options.maxVersion = "TLSv1.3";
            }

            // Create request
            let request;
            try {
                request = https.request(options);
                request.on("connect", () => {
                    this._report.changeStep(format("%s allowed", sslMethod));
                    resolve(new SSLMethodResult(sslMethod, true, ""));
                });

                request.on("error", (err: any) => {
                    if (!sendResponse) {
                        sendResponse = true;
                        if (!err.code) {
                            winston.debug("SSLMethodChecker.runQuery - Error during request processing: ", err);
                        }
                        resolve(new SSLMethodResult(sslMethod, false, err.code ? err.code : "NO ERROR CODE"));
                    }
                });

            } catch (err) {
                if (err && err.code === "ERR_TLS_INVALID_PROTOCOL_METHOD") {
                    resolve(new SSLMethodResult(sslMethod, false, ""));
                } else {
                    if (!sendResponse) {
                        if (!err.code) {
                            winston.debug("SSLMethodChecker.runQuery - Error during request building: ", err);
                        }
                        winston.error("SSLMethodChecker.runQuery - InternalError: ", err.code ? err.code : "NO ERROR CODE");
                        sendResponse = true;
                        resolve(new SSLMethodResult(sslMethod, false, err));
                    }
                }
            }

            if (request) {
                request.end();
            }
        });
    }

    public get host() {
        return this._host;
    }

    public get port() {
        return this._port;
    }

    public get results() {
        return this._results;
    }

    public static fromArgs(content: string) {
        return null;
    }
}


export enum SSL_METHOD {
    SSLV3 = "SSLv3", // Node disable SSL V3 from the node version 9
    TLSV1 = "TLSv1",
    TLSV1_1 = "TLSv1.1",
    TLSV1_2 = "TLSv1.2",
    TLSV1_3 = "TLSv1.3",
}