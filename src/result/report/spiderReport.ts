import * as util from "util";
import { Spider } from "../../system/spider/spider";
import { Report } from "./report";
import { Session } from "../session";
import * as winston from "winston";

export class SpiderReport extends Report {

    writeRequest(spider: Spider) {
        winston.info(Report.SEPARATOR);
        winston.info("                SPIDER");
        winston.info(Report.SEPARATOR);
        winston.info(util.format("Session: %s", Session.instance.id));
        winston.info(util.format("Date: %s", new Date()));
        winston.info(util.format("Host: '%s'", spider.host));
        winston.info(util.format("Port: '%d'", spider.port));
        winston.info(util.format("MaxDepth: '%d'", spider.maxDepth));
        winston.info(Report.SEPARATOR);
    }
}