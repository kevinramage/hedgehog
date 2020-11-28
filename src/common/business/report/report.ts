import { ISystem } from "../../../system/ISystem";
import * as util from "util";
import * as winston from "winston";
import { IChecker } from "../../../checker/IChecker";

export class Report {

    protected static SEPARATOR = "---------------------------------------";
    protected _startTime ?: Date;
    protected _endTime ?: Date;
    protected _executionTime : string;

    constructor() {
        this._executionTime = "";
    }

    public writeRequest(system: ISystem | IChecker) {
        this._startTime = new Date();
    }

    public changeStep(stepName: string) {
        winston.info(util.format("%s", stepName));
    }

    public writeSummary(system: ISystem | IChecker) {
        this._endTime = new Date();
        this.computeExecutionTime();
    }

    protected computeExecutionTime() {
        if (this._startTime && this._endTime) {
            this._executionTime = util.format("%d ms", this._endTime.getTime() - this._startTime.getTime());
        }
    }
}