import { ArrayUtils } from "../../../utils/arrayUtils";
import { IBaseScoreMetrics } from "../baseScoreMetrics";
import { SQLInjection } from "./SQLInjection";


import PAYLOADS = require("../../../../config/payloads/SQLAndPayloads.json");
import BASESCOREMETRICS = require("../../../../config/cvss/baseScoreMetricsSQLAnd.json");

export class SQLAndInjector extends SQLInjection {

    constructor() {
        super();
        this._payloads = ArrayUtils.shuffle(PAYLOADS as string[]);
        this._baseScoreMetrics = BASESCOREMETRICS as IBaseScoreMetrics;
        this._templateFileName = "resources/template/test/SQLAndTemplate.html";
        this._mustHaveSimilarLength = false;
    }


    public static get executorName() {
        return "SQLAndInjection";
    }
}