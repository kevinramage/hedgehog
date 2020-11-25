import * as util from "util";
import { Spider } from "../../system/spider/spider";
import { Report } from "./report";
import { Session } from "../session";

export class SpiderReport extends Report {
    
    writeRequest(spider: Spider) {
        console.info(Report.SEPARATOR);
        console.info("                SPIDER");
        console.info(util.format("Session: %s", Session.instance.id));
        console.info(util.format("Date: %s", new Date()));
        console.info(util.format("Host: '%s'", spider.host));
        console.info(util.format("Port: '%d'", spider.port));
        console.info(util.format("MaxDepth: '%d'", spider.maxDepth));
        console.info(Report.SEPARATOR);
    }
}