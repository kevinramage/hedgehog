import * as util from "util";
import { Report } from "./report";
import { Session } from "../session/session";
import { ProxySystem } from "../../../system/proxy/proxySystem";
import * as winston from "winston";

export class ProxyReport extends Report {

    writeRequest(proxy: ProxySystem) {
        winston.info(Report.SEPARATOR);
        winston.info("                PROXY");
        winston.info(Report.SEPARATOR);
        winston.info(util.format("Session: %s", Session.instance.id));
        winston.info(util.format("Date: %s", new Date()));
        winston.info(util.format("Host: '%s'", proxy.host));
        winston.info(util.format("Port: '%d'", proxy.port));
        winston.info(Report.SEPARATOR);
    }
}