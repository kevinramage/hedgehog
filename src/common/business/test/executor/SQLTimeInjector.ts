import * as winston from "winston";
import { ArrayUtils } from "../../../utils/arrayUtils";
import { IBaseScoreMetrics } from "../baseScoreMetrics";
import { SQLInjection } from "./SQLInjection";
import { Response } from "../../request/response";

import PAYLOADS = require("../../../../config/payloads/SQLTimePayloads.json");
import BASESCOREMETRICS = require("../../../../config/cvss/baseScoreMetricsSQLTime.json");
import { PrettyPrint } from "../../../utils/prettyPrint";

export class SQLTimeInjector extends SQLInjection {

    private _injectionTime : number;

    constructor() {
        super();
        this._payloads = ArrayUtils.shuffle(PAYLOADS as string[]);
        this._baseScoreMetrics = BASESCOREMETRICS as IBaseScoreMetrics;
        this._templateFileName = "resources/template/test/SQLTimeTemplate.html";
        this._injectionTime = 5;
    }

    protected returnMetric(response: Response) {
        return response.executionTime as number;
    }

    protected evaluateInjectionResult(metric: number) {
        return metric > this._injectionTime * 1000;
    }

    protected interpolatePayloadContent(payload: string) {
        return payload.replace("{{TIME}}", this._injectionTime + "");
    }

    protected generatePayloadsVariable() : any[] {
        winston.debug("SQLInjector.generatePayloadsVariable");
        return this._payloadResults.map(r => {
            return {
                "content": r.payload,
                "statusClass": (r.status === "NOT_INJECTED") ? "SUCCESS" : "FAILED",
                "status": r.status,
                "time": PrettyPrint.printTime(r.data as number),
                "reference": PrettyPrint.printTime(this._injectionTime * 1000),
            }
        });
    }

    public static get executorName() {
        return "SQLTimeInjection";
    }
}