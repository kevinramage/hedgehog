import { ArrayUtils } from "../../../utils/arrayUtils";
import { IBaseScoreMetrics } from "../baseScoreMetrics";
import { SQLInjection } from "./SQLInjection";


import PAYLOADS = require("../../../../config/payloads/SQLTimePayloads.json");
import BASESCOREMETRICS = require("../../../../config/cvss/baseScoreMetricsSQLTime.json");

export class SQLTimeInjector extends SQLInjection {

    constructor() {
        super();
        this._payloads = ArrayUtils.shuffle(PAYLOADS as string[]);
        this._baseScoreMetrics = BASESCOREMETRICS as IBaseScoreMetrics;
        this._templateFileName = "resources/template/test/SQLTimeTemplate.html";
    }


    public static get executorName() {
        return "SQLTimeInjection";
    }
}