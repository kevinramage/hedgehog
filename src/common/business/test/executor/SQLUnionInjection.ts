import { ArrayUtils } from "../../../utils/arrayUtils";
import { IBaseScoreMetrics } from "../baseScoreMetrics";
import { SQLInjection } from "./SQLInjection";


import PAYLOADS = require("../../../../config/payloads/SQLUnionPayloads.json");
import BASESCOREMETRICS = require("../../../../config/cvss/baseScoreMetricsSQLUnion.json");

export class SQLUnionInjector extends SQLInjection {

    constructor() {
        super();
        this._payloads = ArrayUtils.shuffle(PAYLOADS as string[]);
        this._baseScoreMetrics = BASESCOREMETRICS as IBaseScoreMetrics;
        this._templateFileName = "resources/template/test/SQLUnionTemplate.html";
    }

    protected evaluateInjectionResult(length: number) {
        return length > this.referenceLength;
    }

    public static get executorName() {
        return "SQLUnionInjection";
    }
}