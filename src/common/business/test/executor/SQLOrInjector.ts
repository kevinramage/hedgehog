import * as winston from "winston";
import { readFileSync } from "fs";

import { Request } from "../../request/request";
import { ISQLOrDescription } from "../description/SQLOrDescription";
import { PayloadResult, PayloadResultType } from "../payloadResult";
import { TestExecutor } from "../testExecutor";
import { Evaluator } from "../../evaluator";
import { PrettyPrint } from "../../../utils/prettyPrint";
import { ArrayUtils } from "../../../utils/arrayUtils";

import PAYLOADS = require("../../../../config/payloads/SQLOrPayloads.json");
import BASESCOREMETRICS = require("../../../../config/cvss/baseScoreMetricsSQLOr.json");
import { IBaseScoreMetrics } from "../baseScoreMetrics";
import { CVSSBaseScoreMetricsUtils } from "../../../utils/cvssBaseScoreMetricsUtils";

export class SQLOrInjector extends TestExecutor {

    private _request ?: Request;
    private _delta : number = 20;
    private _referencePayload : string;
    private _referenceLength ?: number;
    private _payloads : string[];
    private _payloadResults : PayloadResult[];

    constructor() {
        super();
        this._referencePayload = "";
        this._payloads = ArrayUtils.shuffle(PAYLOADS as string[]);
        this._payloadResults = [];
        this._baseScoreMetrics = BASESCOREMETRICS as IBaseScoreMetrics;
        this._fixComplexity = "simple";
    }

    protected init() {
        winston.debug("SQLOrInjector.init");

        // Read test
        const test = this.testDescription.test as ISQLOrDescription;
        this._request = this.readRequest(test.request);
        if (test.delta) {
            this._delta = test.delta;
        }
        if (test.referencePayload) {
            this._referencePayload = test.referencePayload;
        }

        // Read report template
        const buffer = readFileSync("resources/template/test/SQLOrTemplate.html");
        this._reportTemplate = buffer.toString();
    }

    protected execute() {
        winston.debug("SQLOrInjector.execute");
        return new Promise<void>(async resolve => {

            const startDateTime = new Date();

            try {

                // Get reference
                this._referenceLength = await this.executeReference();

                // Execute payloads
                this._payloadResults = await this.evaluatePayloads(this._payloads);

                // Compute duration
                const endDateTime = new Date();
                this._time = endDateTime.getTime() - startDateTime.getTime();

                // Update status
                const isInjected = this._payloadResults.find(p => { return p.status !== "NOT_INJECTED"; }) !== undefined;
                this._status = isInjected ? "INJECTED" : "NOT_INJECTED";

            } catch (err) {
                winston.error("SQLOrInjector.execute - Internal error: ", err);
                this._status = "ERROR";

                // Compute duration
                const endDateTime = new Date();
                this._time = endDateTime.getTime() - startDateTime.getTime();
            }

            resolve();
        });
    }

    protected executeReference() {
        winston.debug("SQLOrInjector.executeReference");
        return this.executePayload(this._referencePayload);
    }

    protected executePayload(payload: string) {
        winston.debug("SQLOrInjector.executePayload: " + payload);
        return new Promise<number>((resolve, reject) => {
            const variables = { payload };
            const request = this.request.clone();
            request.evaluate(variables);
            request.send().then((response) => {
                resolve(response.body?.length || 0);
            }).catch((err) => {
                winston.error("SQLOrInjector.executePayload - Internal error: ", err);
                reject(err);
            });
        });
    }

    protected evaluatePayload(payload: string) {
        winston.debug("SQLOrInjector.evaluatePayload: " + payload);
        return new Promise<PayloadResult>((resolve) => {
            const startDateTime = new Date();
            this.executePayload(payload).then((length) => {
                const endDateTime = new Date();
                const duration = endDateTime.getTime() - startDateTime.getTime();
                const injected = length < this.referenceLength - this._delta || length > this.referenceLength + this._delta;
                resolve({
                    status: injected ? "INJECTED" : "NOT_INJECTED",
                    data: length,
                    payload,
                    time: duration
                });
            }).catch((err) => {
                const endDateTime = new Date();
                const duration = endDateTime.getTime() - startDateTime.getTime();
                resolve({
                    status: "ERROR",
                    errorMessage: err.message,
                    payload,
                    time: duration
                });
            });
        });
    }

    protected evaluatePayloads(payloads: string[]) {
        winston.debug("SQLOrInjector.evaluatePayloads: " + payloads.length);
        return new Promise<PayloadResult[]>(async (resolve) => {
            const promises = payloads.map(p => { return this.evaluatePayload(p); });
            resolve(await Promise.all(promises));
        });
    }

    public writeReport() {
        winston.debug("SQLOrInjector.writeReport");
        const baseScoreMetrics = new CVSSBaseScoreMetricsUtils(this.baseScoreMetrics);
        const variables = {
            "test.name": this.testDescription.name,
            "execution.status": this.status,
            "execution.statusClass": this.status === "NOT_INJECTED" ? "SUCCESS" : "FAILED",
            "execution.time": PrettyPrint.printTime(this._time),
            "execution.payloadLength":  this._payloads.length,
            "execution.payloadKOLength": this.payloadResults.filter(r => { return r.status !== "NOT_INJECTED"; }).length,
            "test.fixComplexity": this._fixComplexity,
            "execution.baseScore": baseScoreMetrics.baseScore,
            "execution.impactScore": baseScoreMetrics.roundUp(baseScoreMetrics.impactScore),
            "execution.exploitationScore": baseScoreMetrics.roundUp(baseScoreMetrics.exploitationScore),
            "payloads": this.generatePayloadsVariable(),
            "attackVector.value": this.baseScoreMetrics.AttackVector.value,
            "attackVector.comments": this.baseScoreMetrics.AttackVector.comments,
            "attackComplexity.value": this.baseScoreMetrics.AttackComplexity.value,
            "attackComplexity.comments": this.baseScoreMetrics.AttackComplexity.comments,
            "privilegesRequired.value": this.baseScoreMetrics.PrivilegesRequired.value,
            "privilegesRequired.comments": this.baseScoreMetrics.PrivilegesRequired.comments,
            "userInteraction.value": this.baseScoreMetrics.UserInteraction.value,
            "userInteraction.comments": this.baseScoreMetrics.UserInteraction.comments,
            "scope.value": this.baseScoreMetrics.Scope.value,
            "scope.comments": this.baseScoreMetrics.Scope.comments,
            "confidentialityImpact.value": this.baseScoreMetrics.ConfidentialityImpact.value,
            "confidentialityImpact.comments": this.baseScoreMetrics.ConfidentialityImpact.comments,
            "integrityImpact.value": this.baseScoreMetrics.IntegrityImpact.value,
            "integrityImpact.comments": this.baseScoreMetrics.IntegrityImpact.comments,
            "availabilityImpact.value": this.baseScoreMetrics.AvailabilityImpact.value,
            "availabilityImpact.comments": this.baseScoreMetrics.AvailabilityImpact.comments
        };
        return Evaluator.evaluate(variables, this._reportTemplate);
    }

    protected generatePayloadsVariable() {
        winston.debug("SQLOrInjector.generatePayloadsVariable");
        return this._payloadResults.map(r => {
            return {
                "content": r.payload,
                "statusClass": (r.status === "NOT_INJECTED") ? "SUCCESS" : "FAILED",
                "status": r.status,
                "time": PrettyPrint.printTime(r.time),
                "length": PrettyPrint.printSize(r.data as number),
                "reference": PrettyPrint.printSize(this.referenceLength)
            }
        });
    }

    private get request() {
        return this._request as Request;
    }

    public get referenceLength() {
        return this._referenceLength as number;
    }

    public get status() {
        return this._status;
    }

    public get payloadResults() {
        return this._payloadResults;
    }

    public static get executorName() {
        return "SQLOrInjection";
    }
}