import util from "util";
import { RequestSystem } from "../../system/request/requestSystem";
import { Session } from "../session";
import { Report } from "./report";
import * as winston from "winston";

export class RequestReport extends Report {

    writeRequest(requestSystem: RequestSystem) {
        winston.info(Report.SEPARATOR);
        winston.info("                REQUEST");
        winston.info(Report.SEPARATOR);
        winston.info(util.format("Session: %s", Session.instance.id));
        winston.info(util.format("Date: %s", new Date()));
        winston.info(util.format("Host: '%s'", requestSystem.host));
        winston.info(util.format("Port: '%d'", requestSystem.port));
        winston.info(Report.SEPARATOR);
    }
}