import { MethodChecker } from "../../../checker/method/methodChecker";
import { Report } from "./report";
import * as winston from "winston";
import { format } from "util";

export class MethodReport extends Report {

    writeRequest(methodChecker: MethodChecker) {
        super.writeRequest(methodChecker);

        winston.info(Report.SEPARATOR);
        winston.info("                HTTP METHODS");
        winston.info(Report.SEPARATOR);
        winston.info(format("Date: %s", new Date()));
        winston.info(format("Host: '%s'", methodChecker.host));
        winston.info(format("Port: '%s'", methodChecker.port));
        winston.info(format("SSL: '%s'", methodChecker.ssl));
        winston.info(format("Path: '%s'", methodChecker.path));
        winston.info(format("HTTP Methods to test: '%s'", methodChecker.methodsToCheck.join(", ")));
        winston.info(Report.SEPARATOR);
    }

    writeSummary(methodChecker: MethodChecker) {
        super.writeSummary(methodChecker);
        const results = methodChecker.results;
        const methods = results.filter(m => { return m.isListening || m.errorMessage !== ""; })
            .map(m => { return (m.errorMessage !== "") ? format("%s (%s)", m.httpMethod, m.errorMessage) : m.httpMethod; })
            .join(", ");
        winston.info(Report.SEPARATOR);
        winston.info(format("Execution time: %s", this._executionTime));
        winston.info(format("HTTP Methods: '%s'", methods));
        winston.info(Report.SEPARATOR);
    }
}