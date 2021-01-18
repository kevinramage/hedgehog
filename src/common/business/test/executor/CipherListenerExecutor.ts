import * as winston from "winston";
import { TestExecutor } from "../testExecutor";
import { CipherResult } from "../../checker/cipherResult";
import { readFileSync } from "fs-extra";
import { CipherListener } from "../../checker/cipherListener";
import { ICipherListenerDescription } from "../description/cipherListenerDescription"

import BASESCOREMETRICS = require("../../../../config/cvss/baseScoreMetricsPortListener.json");
import { Evaluator } from "../../evaluator";
import { IBaseScoreMetrics } from "../baseScoreMetrics";

export class CipherListenerExecutor extends TestExecutor {
    private _host: string;
    private _port : number;
    private _path : string;
    private _results : CipherResult[];

    constructor() {
        super();
        this._host = "";
        this._port = 0;
        this._path = "/";
        this._fixComplexity = "simple";
        this._baseScoreMetrics = BASESCOREMETRICS as IBaseScoreMetrics;
        this._templateFileName = "resources/template/test/CipherListenerTemplate.html";
        this._results = [];
    }

    init() {

        // Read test
        const test = this.testDescription.test as ICipherListenerDescription;
        this._host = test.host;
        this._port = test.port;
        if (test.path) {
            this._path = test.path;
        }

        // Read report template
        const buffer = readFileSync(this._templateFileName);
        this._reportTemplate = buffer.toString();
    }

    execute() {
        return new Promise<void>(async (resolve) => {

            // Run cipher listener
            const cipherListener = new CipherListener(this._host, this._port, this._path);
            await cipherListener.run();

            // Collect results
            this._results = cipherListener.results;
            const invalidResults = this._results.filter(r => { return r.status === "INJECTED"; });
            this._status = invalidResults.length > 0 ? "INJECTED" : "NOT_INJECTED";

            resolve();
        });
    }

    writeReport() {
        winston.debug("CipherListenerExecutor.writeReport");
        this.initReportingVariables();

        // Execution
        const portsCheckedLengthKey = "execution.ciphersCheckedLength";
        const portsInjectedLengthKey = "execution.ciphersInjectedLength";
        this.reportingVariables[portsCheckedLengthKey] = this._results.length;
        this.reportingVariables[portsInjectedLengthKey] = this._results.filter(r => { return r.status === "INJECTED"; }).length;

        // Ports
        const portsKey = "ciphers";
        this.reportingVariables[portsKey] = this.generateCiphersVariables();

        return Evaluator.evaluate(this.reportingVariables, this._reportTemplate);
    }

    protected generateCiphersVariables() : any[] {
        winston.debug("CipherListenerExecutor.generatePayloadsVariable");
        return this._results.map(r => {
            return {
                "content": r.cipher,
                "category": r.category,
                "statusClass": (r.status === "NOT_INJECTED") ? "SUCCESS" : "FAILED",
                "status": r.isListening ? "LISTENING" : "NOT LISTENING"
            }
        });
    }

    public static get executorName() {
        return "CipherListenerExecutor";
    }
}