import { ArrayUtils } from "../../../utils/arrayUtils";
import { IBaseScoreMetrics } from "../baseScoreMetrics";
import { SQLInjection } from "./SQLInjection";


import PAYLOADS = require("../../../../config/payloads/SQLOrPayloads.json");
import BASESCOREMETRICS = require("../../../../config/cvss/baseScoreMetricsSQLOr.json");

export class SQLOrInjector extends SQLInjection {

    constructor() {
        super();
        this._payloads = ArrayUtils.shuffle(PAYLOADS as string[]);
        this._baseScoreMetrics = BASESCOREMETRICS as IBaseScoreMetrics;
        this._templateFileName = "resources/template/test/SQLOrTemplate.html";
    }


    public static get executorName() {
        return "SQLOrInjection";
    }
}