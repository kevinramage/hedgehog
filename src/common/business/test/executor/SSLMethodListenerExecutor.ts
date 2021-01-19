import * as winston from "winston";
import { TestExecutor } from "../testExecutor";
import BASESCOREMETRICS = require("../../../../config/cvss/baseScoreMetricsSSLMethod.json");
import { IBaseScoreMetrics } from "../baseScoreMetrics";
import { SSLMethodResult } from "../../checker/sslMethodResult";
import { ISSLMethodDescription } from "../description/sslMethodDescription";
import { readFileSync } from "fs-extra";
import { SSLMethodListener } from "../../checker/sslMethodListener";
import { SSL_METHOD } from "../../checker/SSLMethod";
import { Evaluator } from "../../evaluator";

export class SSLMethodListenerExecutor extends TestExecutor {
    private _host : string;
    private _port : number;
    private _sslMethodResults : SSLMethodResult[];

    constructor() {
        super();
        this._host = "";
        this._port = 0;
        this._sslMethodResults = [];
        this._fixComplexity = "simple";
        this._baseScoreMetrics = BASESCOREMETRICS as IBaseScoreMetrics;
        this._templateFileName = "resources/template/test/SSLMethodTemplate.html";
    }

    init() {

        // Read test
        const test = this.testDescription.test as ISSLMethodDescription;
        this._host = test.host;
        this._port = test.port;

        // Read report template
        const buffer = readFileSync(this._templateFileName);
        this._reportTemplate = buffer.toString();
    }

    execute() {
        return new Promise<void>(async (resolve) => {

            // Run SSL method listener
            const sslMethodListener = new SSLMethodListener(this._host, this._port);
            await sslMethodListener.run();

            // Collect results
            this._sslMethodResults = sslMethodListener.results;
            this._sslMethodResults.forEach(r => {
                if (r.sslMethod === SSL_METHOD.SSLV3 && (r.isAllowed || r.errorMessage !== "")) {
                    r.status = "INJECTED";
                } else if (r.sslMethod === SSL_METHOD.TLSV1 && (r.isAllowed || r.errorMessage !== "")) {
                    r.status = "WARNING";
                } else if (r.sslMethod === SSL_METHOD.TLSV1_1 && (r.isAllowed || r.errorMessage !== "")) {
                    r.status = "WARNING";
                } else {
                    r.status = "NOT_INJECTED";
                }
            });
            const worstSSLMethodResult = this._sslMethodResults.reduce((a, b) => {
                if (a.status === "INJECTED") { return a; }
                else if (b.status === "INJECTED") { return b; }
                else if (a.status === "WARNING") { return a; }
                else if (b.status === "WARNING") { return b; }
                else { return a; }
            });
            this._status = worstSSLMethodResult.status;

            resolve();
        });
    }

    writeReport() {
        winston.debug("SSLMethodExecutor.writeReport");
        this.initReportingVariables();

        // Execution
        const sslMethodsCheckedLengthKey = "execution.sslMethodsCheckedLength";
        const sslMethodsInjectedLengthKey = "execution.sslMethodsListeningLength";
        this.reportingVariables[sslMethodsCheckedLengthKey] = this._sslMethodResults.length;
        this.reportingVariables[sslMethodsInjectedLengthKey] = this._sslMethodResults.filter(r => { return r.status === "INJECTED"; }).length;

        // Ports
        const portsKey = "sslMethods";
        this.reportingVariables[portsKey] = this.generateSSLMethodsVariable();

        return Evaluator.evaluate(this.reportingVariables, this._reportTemplate);
    }

    protected generateSSLMethodsVariable() : any[] {
        winston.debug("SSLMethodExecutor.generatePayloadsVariable");
        return this._sslMethodResults.map(r => {
            return {
                "content": r.sslMethod,
                "statusClass": (r.status !== "NOT_INJECTED") ? (r.status === "WARNING") ? "WARNING" : "FAILED" : "SUCCESS" ,
                "status": (r.isAllowed) ? "LISTENING" : "NOT LISTENING"
            }
        });
    }

    public static get executorName() {
        return "SSLMethodListenerExecutor";
    }
}