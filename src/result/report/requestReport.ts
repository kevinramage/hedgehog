import util from "util";
import { RequestSystem } from "../../system/request/requestSystem";
import { Session } from "../session";
import { Report } from "./report";

export class requestReport extends Report {

    writeRequest(requestSystem: RequestSystem) {
        console.info(Report.SEPARATOR);
        console.info("                REQUEST");
        console.info(util.format("Session: %s", Session.instance.id));
        console.info(util.format("Date: %s", new Date()));
        console.info(util.format("Host: '%s'", requestSystem.host));
        console.info(util.format("Port: '%d'", requestSystem.port));
        console.info(Report.SEPARATOR);
    }
}