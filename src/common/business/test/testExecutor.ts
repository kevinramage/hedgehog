import { CVSSBaseScoreMetricsUtils } from "../../utils/cvssBaseScoreMetricsUtils";
import * as winston from "winston";
import { Request } from "../request/request";
import { IBaseScoreMetrics } from "./baseScoreMetrics";
import { PayloadResult, PayloadResultType } from "./payloadResult";
import { ITestDescriptionHeader } from "./description/testDescriptionHeader";
import { PrettyPrint } from "../../utils/prettyPrint";

export type FIX_COMPLEXITY = "simple" | "medium" | "complexity";

export class TestExecutor {

    protected _request ?: Request;
    protected _testDescription : ITestDescriptionHeader | undefined;
    protected _status : PayloadResultType;
    protected _reportTemplate : string;
    protected _time : number;
    protected _baseScoreMetrics : IBaseScoreMetrics | undefined;
    protected _fixComplexity : FIX_COMPLEXITY | undefined;
    protected _reportingVariables : {[key: string]: any} | undefined;
    protected _templateFileName : string;
    protected _payloadResults : PayloadResult[];

    constructor() {
        this._status = "NOT_DEFINED";
        this._reportTemplate = "";
        this._time = 0;
        this._templateFileName = "";
        this._payloadResults = [];
    }

    protected initReportingVariables() {
        const baseScoreMetrics = new CVSSBaseScoreMetricsUtils(this.baseScoreMetrics);
        this._reportingVariables = {
            "test.name": this.testDescription.name,
            "execution.status": this.status,
            "execution.statusClass": this.status === "NOT_INJECTED" ? "SUCCESS" : "FAILED",
            "execution.time": PrettyPrint.printTime(this._time),
            "test.fixComplexity": this._fixComplexity,
            "execution.baseScore": baseScoreMetrics.baseScore,
            "execution.impactScore": baseScoreMetrics.roundUp(baseScoreMetrics.impactScore),
            "execution.exploitationScore": baseScoreMetrics.roundUp(baseScoreMetrics.exploitationScore),
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
        const request = Request.instanciateFromUrl(req.url, req.method || "GET");
        if (req.headers) {
            Object.keys(req.headers).forEach(key => {
                request.addHeader(key, req.headers[key]);
            });
        }
        request.body = req.body ? req.body : "";

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

    protected get reportingVariables() {
        return this._reportingVariables as {[key: string]: any};
    }

    protected get request() {
        return this._request as Request;
    }

    public get payloadResults() {
        return this._payloadResults;
    }
}