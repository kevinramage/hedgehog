import { readFileSync } from "fs-extra";
import * as winston from "winston";
import { MethodListener } from "../../checker/methodListener";
import { MethodResult } from "../../checker/methodResult";
import { Evaluator } from "../../evaluator";
import { IBaseScoreMetrics } from "../baseScoreMetrics";
import { IMethodListenerListenerDescription } from "../description/methodListenerDescription";
import { TestExecutor } from "../testExecutor";

import BASESCOREMETRICS = require("../../../../config/cvss/baseScoreMetricsMethodListener.json");

export class MethodListenerExecutor extends TestExecutor {
    private _host: string;
    private _port: number;
    private _path: string;
    private _isSSL: boolean;
    private _results: MethodResult[];

    constructor() {
        super();
        this._host = "";
        this._port = 0;
        this._path = "";
        this._isSSL = false;
        this._fixComplexity = "medium";
        this._baseScoreMetrics = BASESCOREMETRICS as IBaseScoreMetrics;
        this._templateFileName = "resources/template/test/MethodListenerTemplate.html";
        this._results = [];
    }

    init() {

        // Read test
        const test = this.testDescription.test as IMethodListenerListenerDescription;
        this._host = test.host;
        this._port = test.port;
        if (test.path) {
            this._path = test.path;
        }
        if (test.ssl === true || this._port === 443) {
            this._isSSL = test.ssl;
        }

        // Read report template
        const buffer = readFileSync(this._templateFileName);
        this._reportTemplate = buffer.toString();
    }

    execute() {
        return new Promise<void>(async (resolve) => {

            // Run method listener
            const methodListener = new MethodListener(this._host, this._port, this._path, this._isSSL);
            await methodListener.run();

            // Collect results
            this._results = methodListener.results;
            const invalidResults = this._results.filter(r => { return r.status === "INJECTED"; });
            this._status = invalidResults.length > 0 ? "INJECTED" : "NOT_INJECTED";

            resolve();
        });
    }

    writeReport() {
        winston.debug("CipherListenerExecutor.writeReport");
        this.initReportingVariables();

        // Execution
        const methodsCheckedLengthKey = "execution.methodsCheckedLength";
        const methodsInjectedLengthKey = "execution.methodsInjectedLength";
        this.reportingVariables[methodsCheckedLengthKey] = this._results.length;
        this.reportingVariables[methodsInjectedLengthKey] = this._results.filter(r => { return r.status === "INJECTED"; }).length;

        // Methods
        const methodsKey = "methods";
        this.reportingVariables[methodsKey] = this.generateMethodsVariables();

        return Evaluator.evaluate(this.reportingVariables, this._reportTemplate);
    }

    protected generateMethodsVariables() : any[] {
        winston.debug("MethodListenerExecutor.generatePayloadsVariable");
        return this._results.map(r => {
            return {
                "content": r.httpMethod,
                "statusClass": (r.status === "NOT_INJECTED") ? "SUCCESS" : "FAILED",
                "status": r.isListening ? "LISTENING" : "NOT LISTENING"
            }
        });
    }

    public static get executorName() {
        return "MethodListenerExecutor";
    }
}