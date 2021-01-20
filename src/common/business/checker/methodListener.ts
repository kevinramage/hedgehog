import { IncomingMessage, RequestOptions, request } from "http";
import * as https from "https";
import { RequestUtil } from "../../utils/requestUtil";
import { format } from "util";
import { Report } from "../report/report";
import { Proxy } from "../request/proxy";
import { REQUEST_METHODS } from "../request/request";
import { MethodResult } from "./methodResult";

import HTTP_METHODS = require("../../../config/connection/httpMethod.json");

export class MethodListener {
    private _host: string;
    private _port: number;
    private _path: string;
    private _ssl: boolean;
    private _methodsToCheck: string[];
    private _results: MethodResult[];
    private _report?: Report;

    constructor(host: string, port: number, path: string, ssl: boolean, report ?: Report) {
        this._host = host;
        this._port = port;
        this._path = path;
        this._ssl = ssl;
        this._methodsToCheck = [];
        this._results = [];
    }

    /**
     * Run the execution of the checker
     */
    public run(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            this._methodsToCheck = HTTP_METHODS as string[];
            if (this._report) {
                this._report.writeRequest(this);
            }
            const promises = this._methodsToCheck.map(m => { return this.runQuery(m.toUpperCase()); });
            this._results = await Promise.all(promises);
            this._results.forEach(r => {
                const isInjected = r.isListening && (r.httpMethod === "TRACE" || r.httpMethod === "DEBUG");
                r.status = isInjected ? "INJECTED" : "NOT_INJECTED";
            });
            if (this._report) {
                this._report.writeSummary(this);
            }
            resolve();
        });
    }

    /**
     * Check the availability of http method for an host, port and path
     * @param httpMethod http method to check
     */
    private runQuery(httpMethod: string) {
        return new Promise<MethodResult>(async (resolve) => {

            // Prepare request
            const options : RequestOptions = {
                hostname: this._host,
                path: encodeURI(this._path),
                method: httpMethod
            };

            // For HTTP request, we must not defined port attribute for port 80
            if (this._port !== 80) {
                options.port = this._port;
            }

            // Update options when proxy defined
            const proxy = await Proxy.getProxy();
            Proxy.updateRequestWithProxy(proxy, this.ssl, options);

            // Handler
            let responseProvided = false;
            const errorHandler = (err: any) => {
                if (!responseProvided) {
                    responseProvided = true;
                    const errorCode = (err.code) ? err.code : "NO ERROR CODE";
                    resolve(new MethodResult(httpMethod, false, errorCode));
                }
            };

            // Response handler
            const responseHandler = (response : IncomingMessage) => {
                response.on("error", errorHandler);
                response.on("data", () => {
                    // Listener required else the end listener not trigger, bug ??
                });
                response.on("end", () => {
                    if (!response.statusCode || !response.statusCode.toString().startsWith("4")){
                        if (this._report) {
                            this._report.changeStep(format("%s listening => %d", httpMethod, response.statusCode));
                        }
                        resolve(new MethodResult(httpMethod, true, ""));
                    } else {
                        resolve(new MethodResult(httpMethod, false, ""));
                    }
                });
            };

            // Run request
            try {
                // Create request
                const req = this._ssl ? https.request(options, responseHandler) : request(options, responseHandler);

                // Connect
                req.on("connect", (response) => {
                    if (httpMethod === REQUEST_METHODS.CONNECT) {
                        if (!response.statusCode || !response.statusCode.toString().startsWith("4")){
                            if (this._report) {
                                this._report.changeStep(format("%s listening => %d", httpMethod, response.statusCode));
                            }
                            resolve(new MethodResult(httpMethod, true, ""));
                        } else {
                            resolve(new MethodResult(httpMethod, false, ""));
                        }
                    }
                });

                // Error handling
                req.on("error", (errorHandler));

                // Add proxy authorization if required
                Proxy.addProxyAuthorization(req, proxy);

                // Add additionnal headers
                RequestUtil.addAdditionalHeaders(req);

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

    public get ssl() {
        return this._ssl;
    }

    public get results() {
        return this._results;
    }
}