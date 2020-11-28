import { PortListenerChecker } from "../../../checker/port/portListenerChecker";
import { Report } from "./report";
import * as winston from "winston";
import { format } from "util";

export class PortReport extends Report{

    writeRequest(portListener: PortListenerChecker) {
        super.writeRequest(portListener);

        // Pretty print ports
        let ports;
        if (portListener.ports.length > 20) {
            const start = portListener.ports.filter((p, i) => { return i < 3; }).join(", ");
            const end = portListener.ports.filter((p, i) => { return i > portListener.ports.length - 4; }).join(", ");
            ports = format("%s ... %s", start, end);
        } else {
            ports = portListener.ports.join(", ");
        }

        winston.info(Report.SEPARATOR);
        winston.info("                PORT LISTENER");
        winston.info(Report.SEPARATOR);
        winston.info(format("Date: %s", new Date()));
        winston.info(format("Host: '%s'", portListener.host));
        winston.info(format("Ports: '%s'", ports));
        winston.info(Report.SEPARATOR);
    }

    writeSummary(portListener: PortListenerChecker) {
        super.writeSummary(portListener);
        const compare = (a: number, b: number) => { return a > b ? 1 : -1; };
        const results = portListener.results;
        const ports = results.filter(p => { return p.isListening; }).map(p => { return p.port; }).sort(compare).join(", ");
        winston.info(Report.SEPARATOR);
        winston.info(format("Execution time: %s", this._executionTime));
        winston.info(format("Ports opened: '%s'", ports));
        winston.info(Report.SEPARATOR);
    }
}