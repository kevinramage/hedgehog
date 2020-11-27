import { ISystem } from "../../system/ISystem";
import * as util from "util";
import { Session } from "../session";
import * as winston from "winston";

export class Report {

    protected static SEPARATOR = "---------------------------------------";

    public writeRequest(system: ISystem) {
        winston.info(Report.SEPARATOR);
    }

    public changeStep(stepName: string) {
        winston.info(util.format("- %s", stepName));
    }

    public writeSummary(system: ISystem) {
        winston.info(Report.SEPARATOR);
        winston.info("Warnings: " + Session.instance.warningCount);
        winston.info(Report.SEPARATOR);
    }
}