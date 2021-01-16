import * as winston from "winston";
import { ISQLDescription } from "../description/SQLDescription";
import { PayloadResult } from "../payloadResult";
import { TestExecutor } from "../testExecutor";
import { Response } from "../../request/response";
import { readFileSync } from "fs";
import { Evaluator } from "../../evaluator";
import { PrettyPrint } from "../../../utils/prettyPrint";

export class SQLInjection extends TestExecutor {

    protected _delta : number = 20;
    protected _referencePayload : string;
    protected _reference ?: number;
    protected _payloads : string[];

    constructor() {
        super();
        this._referencePayload = "";
        this._fixComplexity = "simple";
        this._payloads = [];
    }

    protected init() {
        winston.debug("SQLInjector.init");

        // Read test
        const test = this.testDescription.test as ISQLDescription;
        this._requests = this.readRequests(test.requests);
        if (test.delta) {
            this._delta = test.delta;
        }
        if (test.referencePayload) {
            this._referencePayload = test.referencePayload;
        }

        // Read report template
        const buffer = readFileSync(this._templateFileName);
        this._reportTemplate = buffer.toString();
    }

    protected execute() {
        winston.debug("SQLInjector.execute");
        return new Promise<void>(async resolve => {
            const startDateTime = new Date();

            try {

                // Get reference
                this._reference = await this.executeReference();

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
        winston.debug("SQLInjector.executeReference");
        return this.executePayload(this._referencePayload);
    }

    protected executePayload(payload: string) {
        winston.debug("SQLInjector.executePayload: " + payload);
        return new Promise<number>((resolve, reject) => {
            const variables = { payload };
            const requests = this.requests.clone();
            requests.send(variables).then((response) => {
                const metric = this.returnMetric(response);
                resolve(metric);
            }).catch((err) => {
                winston.error("SQLInjector.executePayload - Internal error: ", err);
                reject(err);
            });
        });
    }

    protected returnMetric(response: Response) : number {
        return response.body?.length || 0;
    }

    protected interpolatePayloadContent(payload: string) {
        return payload;
    }

    protected evaluatePayload(payload: string) {
        winston.debug("SQLInjector.evaluatePayload: " + payload);
        return new Promise<PayloadResult>((resolve) => {
            const startDateTime = new Date();
            this.executePayload(this.interpolatePayloadContent(payload)).then((metric) => {
                const endDateTime = new Date();
                const duration = endDateTime.getTime() - startDateTime.getTime();
                const injected = this.evaluateInjectionResult(metric);
                resolve({
                    status: injected ? "INJECTED" : "NOT_INJECTED",
                    data: metric,
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
        winston.debug("SQLInjector.evaluatePayloads: " + payloads.length);
        return new Promise<PayloadResult[]>(async (resolve) => {
            const promises = payloads.map(p => { return this.evaluatePayload(p); });
            resolve(await Promise.all(promises));
        });
    }

    public writeReport() {
        winston.debug("SQLInjector.writeReport");
        const payloadsKey = "payloads";
        this.initReportingVariables();
        this.reportingVariables["execution.payloadLength"] = this._payloads.length;
        this.reportingVariables["execution.payloadKOLength"] = this.payloadResults.filter(r => { return r.status !== "NOT_INJECTED"; }).length;
        this.reportingVariables[payloadsKey] = this.generatePayloadsVariable();
        return Evaluator.evaluate(this.reportingVariables, this._reportTemplate);
    }

    protected generatePayloadsVariable() : any[] {
        winston.debug("SQLInjector.generatePayloadsVariable");
        return this._payloadResults.map(r => {
            return {
                "content": r.payload,
                "statusClass": (r.status === "NOT_INJECTED") ? "SUCCESS" : "FAILED",
                "status": r.status,
                "time": PrettyPrint.printTime(r.time as number),
                "length": PrettyPrint.printSize(r.data as number),
                "reference": PrettyPrint.printSize(this.reference)
            }
        });
    }

    protected evaluateInjectionResult(metric: number) : boolean {
        throw new Error("Method not implemented.");
    }

    public get reference() {
        return this._reference as number;
    }

    public get status() {
        return this._status;
    }
}