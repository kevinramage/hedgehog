import { ArrayUtils } from "../../../utils/arrayUtils";
import { IBaseScoreMetrics } from "../baseScoreMetrics";
import { SQLInjection } from "./SQLInjection";


import PAYLOADS = require("../../../../config/payloads/SQLErrorPayloads.json");
import BASESCOREMETRICS = require("../../../../config/cvss/baseScoreMetricsSQLError.json");

export class SQLErrorInjector extends SQLInjection {

    constructor() {
        super();
        this._payloads = ArrayUtils.shuffle(PAYLOADS as string[]);
        this._baseScoreMetrics = BASESCOREMETRICS as IBaseScoreMetrics;
        this._templateFileName = "resources/template/test/SQLErrorTemplate.html";
    }


    public static get executorName() {
        return "SQLErrorInjection";
    }
}