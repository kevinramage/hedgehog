import { FuzzingChecker } from "../../../checker/fuzzing/fuzzingChecker";
import { Report } from "./report";

import * as winston from "winston";
import { format } from "util";

export class FuzzingReport extends Report {

    writeRequest(fuzzingChecker: FuzzingChecker) {
        super.writeRequest(fuzzingChecker);

        winston.info(Report.SEPARATOR);
        winston.info("                " + fuzzingChecker.name);
        winston.info(Report.SEPARATOR);
        winston.info(format("Date: %s", new Date()));
        winston.info(format("Host: '%s'", fuzzingChecker.host));
        winston.info(format("Port: '%d'", fuzzingChecker.port));
        winston.info(Report.SEPARATOR);
    }

    writeSummary(fuzzingChecker: FuzzingChecker) {
        super.writeSummary(fuzzingChecker);
        const results = fuzzingChecker.results;
        const methods = results.filter(m => { return m.isExposed || m.errorMessage !== ""; })
            .map(m => { return (m.errorMessage !== "") ? format("%s (%s)", m.path, m.errorMessage) : m.path; })
            .join(", ");
        winston.info(Report.SEPARATOR);
        winston.info(format("Execution time: %s", this._executionTime));
        winston.info(format("Path: '%s'", methods));
        winston.info(Report.SEPARATOR);
    }
}