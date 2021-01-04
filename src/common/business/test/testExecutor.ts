import { CVSSBaseScoreMetricsUtils } from "../../utils/cvssBaseScoreMetricsUtils";
import * as winston from "winston";
import { Request } from "../request/request";
import { IBaseScoreMetrics } from "./baseScoreMetrics";
import { PayloadResultType } from "./payloadResult";
import { ITestDescriptionHeader } from "./testDescriptionHeader";

export type FIX_COMPLEXITY = "simple" | "medium" | "complexity";

export class TestExecutor {

    protected _testDescription : ITestDescriptionHeader | undefined;
    protected _status : PayloadResultType;
    protected _reportTemplate : string;
    protected _time : number;
    protected _baseScoreMetrics : IBaseScoreMetrics | undefined;
    protected _fixComplexity : FIX_COMPLEXITY | undefined;

    constructor() {
        this._status = "NOT_DEFINED";
        this._reportTemplate = "";
        this._time = 0;
    }

    public run (testDescription: ITestDescriptionHeader) {
        winston.debug("TestExecutor.run");
        return new Promise<void>(async resolve => {
            this._testDescription = testDescription;

            this.init();
            await this.execute();

            resolve();
        });
    }

    protected init() {
        throw new Error("not implemented");
    }

    protected execute() : Promise<void> {
        throw new Error("not implemented");
    }

    public writeReport() : string {
        throw new Error("not implemented");
    }

    protected readRequest(req: any) {
        winston.debug("TestExecutor.readRequest");
        const request = Request.instanciateFromUrl(req.url, req.method);
        if (req.headers) {
            Object.keys(req.headers).forEach(key => {
                request.addHeader(key, req.headers[key]);
            });
        }
        if (req.body) {
            request.body = req.body;
        }
        return request;
    }

    public get testDescription() {
        return this._testDescription as ITestDescriptionHeader;
    }

    protected get baseScoreMetrics() {
        return this._baseScoreMetrics as IBaseScoreMetrics;
    }

    public get flawScore() {
        const baseScoreMetrics = new CVSSBaseScoreMetricsUtils(this.baseScoreMetrics);
        return baseScoreMetrics.baseScore;
    }

    public get status() {
        return this._status;
    }

    public get fixComplexity() {
        return this._fixComplexity as FIX_COMPLEXITY;
    }
}