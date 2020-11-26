import * as util from "util";
import { Report } from "./report";
import { Session } from "../session";
import { ProxySystem } from "../../system/proxy/proxySystem";

export class ProxyReport extends Report {

    writeRequest(proxy: ProxySystem) {
        console.info(Report.SEPARATOR);
        console.info("                PROXY");
        console.info(util.format("Session: %s", Session.instance.id));
        console.info(util.format("Date: %s", new Date()));
        console.info(util.format("Host: '%s'", proxy.host));
        console.info(util.format("Port: '%d'", proxy.port));
        console.info(Report.SEPARATOR);
    }
}