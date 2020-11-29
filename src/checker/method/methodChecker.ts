import * as https from "https";
import { IChecker } from "../IChecker";
import { MethodResult } from "./methodResult";
import { Report } from "../../common/business/report/report";
import { MethodReport } from "../../common/business/report/methodReport";
import { format } from "util";

import HTTP_METHODS = require("../../config/connection/httpMethod.json");
import { REQUEST_METHODS } from "../../common/business/request/request";

/**
 * Checker to test http method allow by the server
 */
export class MethodChecker implements IChecker {

    private _host : string;
    private _port : number;
    private _path : string;
    private _methodsToCheck: string[];
    private _results : MethodResult[];
    private _report : Report;

    /**
     * Constructor
     * @param host host to check
     * @param port port to check
     * @param path path to check
     */
    constructor(host: string, port: number, path: string) {
        this._host = host;
        this._port = port;
        this._path = path;
        this._methodsToCheck = [];
        this._results = [];
        this._report = new MethodReport();
    }

    /**
     * Run the execution of the checker
     */
    public run(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            this._methodsToCheck = HTTP_METHODS as string[];
            this._report.writeRequest(this);
            const promises = this._methodsToCheck.map(m => { return this.runQuery(m.toUpperCase()); });
            this._results = await Promise.all(promises);
            this._report.writeSummary(this);
            resolve();
        });
    }

    /**
     * Check the availability of http method for an host, port and path
     * @param httpMethod http method to check
     */
    private runQuery(httpMethod: string) {
        return new Promise<MethodResult>((resolve) => {

            // Prepare request
            const options : https.RequestOptions = {
                hostname: this._host,
                port: this._port,
                path: this._path,
                method: httpMethod,
                rejectUnauthorized: false
            };

            // Handler
            let responseProvided = false;
            const errorHandler = (err: any) => {
                if (!responseProvided) {
                    responseProvided = true;
                    const errorCode = (err.code) ? err.code : "NO ERROR CODE";
                    resolve(new MethodResult(httpMethod, false, errorCode));
                }
            };

            // Run request
            try {
                const request = https.request(options, (response) => {
                    response.on("error", errorHandler);
                    response.on("data", () => {
                        // Listener required else the end listener not trigger, bug ??
                    });
                    response.on("end", () => {
                        if (!response.statusCode || !response.statusCode.toString().startsWith("4")){
                            this._report.changeStep(format("%s listening => %d", httpMethod, response.statusCode));
                            resolve(new MethodResult(httpMethod, true, ""));
                        } else {
                            resolve(new MethodResult(httpMethod, false, ""));
                        }
                    });
                });
                request.on("connect", (response) => {
                    if (httpMethod === REQUEST_METHODS.CONNECT) {
                        if (!response.statusCode || !response.statusCode.toString().startsWith("4")){
                            this._report.changeStep(format("%s listening => %d", httpMethod, response.statusCode));
                            resolve(new MethodResult(httpMethod, true, ""));
                        } else {
                            resolve(new MethodResult(httpMethod, false, ""));
                        }
                    }
                });
                request.on("error", errorHandler);
                request.end();
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

    public get results() {
        return this._results;
    }

    public get methodsToCheck() {
        return this._methodsToCheck;
    }

    public static fromArgs(content: string) {
        return null;
    }
}