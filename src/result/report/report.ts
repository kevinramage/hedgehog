import { ISystem } from "../../system/ISystem";

import * as util from "util";
import { Session } from "../session";

export class Report {

    protected static SEPARATOR = "---------------------------------------";

    public writeRequest(system: ISystem) {
        console.info(Report.SEPARATOR);
    }

    public changeStep(stepName: string) {
        console.info(util.format("- %s", stepName));
    }

    public writeSummary(system: ISystem) {
        console.info(Report.SEPARATOR);
        console.info("Warnings: " + Session.instance.warningCount);
        console.info(Report.SEPARATOR);
    }
}