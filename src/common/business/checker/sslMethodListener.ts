import * as winston from "winston";
import * as https from "https";
import { RequestUtil } from "../../utils/requestUtil";
import { Report } from "../report/report";
import { SSLMethodResult } from "./sslMethodResult";
import { SSL_METHOD } from "./SSLMethod";
import { format } from "util";
import { Proxy } from "../request/proxy";

export class SSLMethodListener {
    private _server : string;
    private _port : number;
    private _report ?: Report;
    private _results : SSLMethodResult[];

    constructor(server: string, port: number, report?: Report) {
        this._server = server;
        this._port = port;
        this._results = [];
        this._report = report;
    }

    public run(): Promise<void> {
        winston.debug("SSLMethodListener.run");
        return new Promise<void>(async (resolve) => {
            if (this._report) {
                this._report.writeRequest(this);
            }

            const methods = [SSL_METHOD.SSLV3, SSL_METHOD.TLSV1, SSL_METHOD.TLSV1_1, SSL_METHOD.TLSV1_2, SSL_METHOD.TLSV1_3];
            const promises = methods.map(m => { return this.runQuery(m); });
            this._results = await Promise.all(promises);

            if (this._report) {
                this._report.writeSummary(this);
            }
            resolve();
        });
    }

    private runQuery(sslMethod: string) {
        winston.debug("SSLMethodListener.runQuery");
        let sendResponse = false;
        return new Promise<SSLMethodResult>(async (resolve) => {

            // Request options
            const options : https.RequestOptions = {
                hostname: this._server,
                port: this._port,
                method: "CONNECT",
                rejectUnauthorized: false
            };

            // Apply SSL method restriction
            if (sslMethod !== SSL_METHOD.TLSV1_3) {
                options.secureProtocol = sslMethod.replace(".", "_") + "_method";
            } else {
                options.minVersion = "TLSv1.3";
                options.maxVersion = "TLSv1.3";
            }

            // Update options when proxy defined
            const proxy = await Proxy.getProxy();
            Proxy.updateRequestWithProxy(proxy, true, options);

            // Create request
            let request;
            try {

                // Create request
                request = https.request(options);

                // Connect handler
                request.on("connect", () => {
                    if (this._report) {
                        this._report.changeStep(format("%s allowed", sslMethod));
                    }
                    resolve(new SSLMethodResult(sslMethod, true, ""));
                });

                // Error handler
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
                        resolve(new SSLMethodResult(sslMethod, false, err.code ? err.code : "NO ERROR CODE"));
                    }
                }
            }

            if (request) {

                // Add proxy authorization if required
                Proxy.addProxyAuthorization(request, proxy);

                // Add additionnal headers
                RequestUtil.addAdditionalHeaders(request);

                // Send request
                request.end();
            }
        });
    }

    public get results() {
        return this._results;
    }
}