import * as winston from "winston";
import { ArrayUtils } from "../../../utils/arrayUtils";
import { IBaseScoreMetrics } from "../baseScoreMetrics";
import { readFileSync } from "fs-extra";
import { ITestDescription } from "../description/testDescription";
import { PayloadResult } from "../payloadResult";
import { Evaluator } from "../../evaluator";
import { PrettyPrint } from "../../../utils/prettyPrint";
import { inHTMLData } from "xss-filters";
import { ICheckPayload } from "../description/checkPayload";
import { RequestUtil } from "../../../utils/requestUtil";
import { InjectionTestExecutor } from "../injectionTestExecutor";

import PAYLOADS = require("../../../../config/payloads/XSSPayloads.json");
import BASESCOREMETRICS = require("../../../../config/cvss/baseScoreMetricsReflectedXSS.json");

export class ReflectedXSSInjector extends InjectionTestExecutor {

    protected _payloads : ICheckPayload[];

    constructor() {
        super();
        this._payloads = ArrayUtils.shuffle(PAYLOADS as ICheckPayload[]);
        this._fixComplexity = "simple";
        this._baseScoreMetrics = BASESCOREMETRICS as IBaseScoreMetrics;
        this._templateFileName = "resources/template/test/ReflectedXSSTemplate.html";
    }

    protected init() {
        winston.debug("ReflectedXSS.init");

        // Read test
        const test = this.testDescription.test as ITestDescription;
        this._requests = this.readRequests(test.requests);

        // Read report template
        const buffer = readFileSync(this._templateFileName);
        this._reportTemplate = buffer.toString();
    }

    protected execute() {
        winston.debug("ReflectedXSS.execute");
        return new Promise<void>(async resolve => {
            try {

                // Execute payloads
                await this.executionPayloads();

                // Update status
                const isInjected = this._payloadResults.find(p => { return p.status !== "NOT_INJECTED"; }) !== undefined;
                this._status = isInjected ? "INJECTED" : "NOT_INJECTED";

            } catch (err) {
                winston.error("ReflectedXSS.execute - Internal error: ", err);
                this._status = "ERROR";
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
            const requests = this.requests.clone();
            requests.send(variables).then((response) => {
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