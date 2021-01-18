import * as winston from "winston";
import { PortListener } from "../../checker/portListener";
import { IPortListenerDescription } from "../description/portListenerDescription";
import { TestExecutor } from "../testExecutor";
import { IBaseScoreMetrics } from "../baseScoreMetrics";
import { Evaluator } from "../../evaluator";
import { readFileSync } from "fs-extra";
import { PortResult } from "../../checker/portResult";

import BASESCOREMETRICS = require("../../../../config/cvss/baseScoreMetricsPortListener.json");

export class PortListenerExecutor extends TestExecutor {

    private _host: string;
    private _portsToCheck : number[];
    private _validPorts : number[];
    private _portResults : PortResult[];

    constructor() {
        super();
        this._host = "";
        this._portsToCheck = [];
        this._validPorts = [];
        this._baseScoreMetrics = BASESCOREMETRICS as IBaseScoreMetrics;
        this._templateFileName = "resources/template/test/PortListenerTemplate.html";
        this._portResults = [];
    }

    init() {

        // Read test
        const test = this.testDescription.test as IPortListenerDescription;
        this._host = test.host;
        this._validPorts = test.validPorts;
        for (let i = test.portsToCheck.min; i <= test.portsToCheck.max; i++) {
            this._portsToCheck.push(i);
        }

        // Read report template
        const buffer = readFileSync(this._templateFileName);
        this._reportTemplate = buffer.toString();
    }

    execute() {
        return new Promise<void>(async (resolve) => {

            // Run port listener
            const portListener = new PortListener(this._host, this._portsToCheck);
            await portListener.run();

            // Collect results
            this._portResults = portListener.results;
            this._portResults.forEach(r => { r.status = (r.isListening && !this._validPorts.includes(r.port)) ? "INJECTED" : "NOT_INJECTED" });
            const invalidPorts = this._portResults.filter(r => { return r.status === "INJECTED"; });
            this._status = invalidPorts.length > 0 ? "INJECTED" : "NOT_INJECTED";

            resolve();
        });
    }

    writeReport() {
        winston.debug("PortListenerExecutor.writeReport");
        this.initReportingVariables();

        // Execution
        const portsCheckedLengthKey = "execution.portsCheckedLength";
        const portsInjectedLengthKey = "execution.portsInjectedLength";
        this.reportingVariables[portsCheckedLengthKey] = this._portResults.length;
        this.reportingVariables[portsInjectedLengthKey] = this._portResults.filter(r => { return r.status === "INJECTED"; }).length;

        // Ports
        const portsKey = "ports";
        this.reportingVariables[portsKey] = this.generatePortsVariable();

        return Evaluator.evaluate(this.reportingVariables, this._reportTemplate);
    }

    protected generatePortsVariable() : any[] {
        winston.debug("ReflectedXSS.generatePayloadsVariable");
        return this._portResults.map(r => {
            return {
                "content": r.port,
                "statusClass": (r.status === "NOT_INJECTED") ? "SUCCESS" : "FAILED",
                "status": r.status
            }
        });
    }

    public static get executorName() {
        return "PortListenerExecutor";
    }
}