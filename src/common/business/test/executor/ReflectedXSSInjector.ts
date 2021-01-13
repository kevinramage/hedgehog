import * as winston from "winston";

import { TestExecutor } from "../testExecutor";
import { ArrayUtils } from "../../../utils/arrayUtils";
import { IBaseScoreMetrics } from "../baseScoreMetrics";
import { readFileSync } from "fs-extra";
import { ITestDescription } from "../description/testDescription";
import { PayloadResult } from "../payloadResult";
import { format } from "util";
import { Evaluator } from "../../evaluator";
import { PrettyPrint } from "../../../utils/prettyPrint";

import PAYLOADS = require("../../../../config/payloads/XSSPayloads.json");
import BASESCOREMETRICS = require("../../../../config/cvss/baseScoreMetricsReflectedXSS.json");
import { inHTMLData } from "xss-filters";
import { ICheckPayload } from "../description/checkPayload";
import { RequestUtil } from "../../../utils/requestUtil";

export class ReflectedXSSInjector extends TestExecutor {

    protected _payloads : ICheckPayload[];

    constructor() {
        super();
        this._payloads = ArrayUtils.shuffle(PAYLOADS as ICheckPayload[]);
        this._baseScoreMetrics = BASESCOREMETRICS as IBaseScoreMetrics;
        this._templateFileName = "resources/template/test/ReflectedXSSTemplate.html";
    }

    protected init() {
        winston.debug("ReflectedXSS.init");

        // Read test
        const test = this.testDescription.test as ITestDescription;
        this._request = this.readRequest(test.request);

        // Read report template
        const buffer = readFileSync(this._templateFileName);
        this._reportTemplate = buffer.toString();
    }

    protected execute() {
        winston.debug("ReflectedXSS.execute");
        return new Promise<void>(async resolve => {
            const startDateTime = new Date();
            try {

                // Execute payloads
                await this.executionPayloads();

                // Compute duration
                const endDateTime = new Date();
                this._time = endDateTime.getTime() - startDateTime.getTime();

                // Update status
                const isInjected = this._payloadResults.find(p => { return p.status !== "NOT_INJECTED"; }) !== undefined;
                this._status = isInjected ? "INJECTED" : "NOT_INJECTED";

            } catch (err) {
                winston.error("ReflectedXSS.execute - Internal error: ", err);
                this._status = "ERROR";

                // Compute duration
                const endDateTime = new Date();
                this._time = endDateTime.getTime() - startDateTime.getTime();
            }

            resolve();
        });
    }

    protected executionPayloads() {
        winston.debug("ReflectedXSS.executionPayloads");
        return new Promise<void>(async(resolve) => {
            const promises = this._payloads.map(p => { return this.executePayload(p); });
            this._payloadResults = await Promise.all(promises);
            resolve();
        });
    }

    protected executePayload(payload: ICheckPayload) {
        winston.debug("ReflectedXSS.executePayload");
        return new Promise<PayloadResult>((resolve) => {
            const startDateTime = new Date();
            const id = new Date().getTime();
            const payloadInterpolate = payload.content.replace("{{message}}", id.toString());
            const variables = { payload: RequestUtil.encodeBodyContent(payloadInterpolate)};
            const request = this.request.clone();
            request.evaluate(variables);
            request.send().then((response) => {
                const check = payload.check.replace("{{message}}", id.toString());
                const isInjected = response.body?.toLowerCase().includes(check);
                const endDateTime = new Date();
                const duration = endDateTime.getTime() - startDateTime.getTime();
                resolve({
                    status: isInjected ? "INJECTED" : "NOT_INJECTED",
                    payload: payloadInterpolate,
                    time: duration
                });
            }).catch((err) => {
                const endDateTime = new Date();
                const duration = endDateTime.getTime() - startDateTime.getTime();
                resolve({
                    status: "ERROR",
                    errorMessage: err.message,
                    payload: payloadInterpolate,
                    time: duration
                });
            });
        });
    }

    public writeReport() {
        winston.debug("ReflectedXSS.writeReport");
        const payloadsKey = "payloads";
        this.initReportingVariables();
        this.reportingVariables["execution.payloadLength"] = this._payloads.length;
        this.reportingVariables["execution.payloadKOLength"] = this.payloadResults.filter(r => { return r.status !== "NOT_INJECTED"; }).length;
        this.reportingVariables[payloadsKey] = this.generatePayloadsVariable();
        return Evaluator.evaluate(this.reportingVariables, this._reportTemplate);
    }

    protected generatePayloadsVariable() : any[] {
        winston.debug("ReflectedXSS.generatePayloadsVariable");
        return this._payloadResults.map(r => {
            return {
                "content": inHTMLData(r.payload),
                "statusClass": (r.status === "NOT_INJECTED") ? "SUCCESS" : "FAILED",
                "status": r.status,
                "time": PrettyPrint.printTime(r.time as number)
            }
        });
    }

    public static get executorName() {
        return "ReflectedXSSInjection";
    }
}