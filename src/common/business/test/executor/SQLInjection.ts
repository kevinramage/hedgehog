import * as winston from "winston";
import { ISQLDescription } from "../description/SQLDescription";
import { PayloadResult } from "../payloadResult";
import { TestExecutor } from "../testExecutor";
import { Request } from "../../request/request";
import { readFileSync } from "fs";
import { Evaluator } from "../../evaluator";
import { PrettyPrint } from "../../../utils/prettyPrint";

export class SQLInjection extends TestExecutor {

    protected _request ?: Request;
    protected _delta : number = 20;
    protected _referencePayload : string;
    protected _referenceLength ?: number;
    protected _payloads : string[];
    protected _payloadResults : PayloadResult[];
    protected _templateFileName : string;

    constructor() {
        super();
        this._payloads = [];
        this._referencePayload = "";
        this._payloadResults = [];
        this._fixComplexity = "simple";
        this._templateFileName = "";
    }

    protected init() {
        winston.debug("SQLInjector.init");

        // Read test
        const test = this.testDescription.test as ISQLDescription;
        this._request = this.readRequest(test.request);
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
        winston.debug("SQLInjector.executeReference");
        return this.executePayload(this._referencePayload);
    }

    protected executePayload(payload: string) {
        winston.debug("SQLInjector.executePayload: " + payload);
        return new Promise<number>((resolve, reject) => {
            const variables = { payload };
            const request = this.request.clone();
            request.evaluate(variables);
            request.send().then((response) => {
                resolve(response.body?.length || 0);
            }).catch((err) => {
                winston.error("SQLInjector.executePayload - Internal error: ", err);
                reject(err);
            });
        });
    }

    protected evaluatePayload(payload: string) {
        winston.debug("SQLInjector.evaluatePayload: " + payload);
        return new Promise<PayloadResult>((resolve) => {
            const startDateTime = new Date();
            this.executePayload(payload).then((length) => {
                const endDateTime = new Date();
                const duration = endDateTime.getTime() - startDateTime.getTime();
                const injected = this.evaluateInjectionResult(length);
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

    protected generatePayloadsVariable() {
        winston.debug("SQLInjector.generatePayloadsVariable");
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

    protected evaluateInjectionResult(length: number) : boolean {
        throw new Error("Method not implemented.");
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
}