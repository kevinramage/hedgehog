
import { Report } from "./report";
import * as winston from "winston";
import { format } from "util";
import { SSLMethodChecker } from "../../../checker/sslMethod/sslMethodChecker";
import { SSL_METHOD } from "../checker/SSLMethod";

export class SSLReport extends Report{

    writeRequest(sslMethodChecker: SSLMethodChecker) {
        super.writeRequest(sslMethodChecker);

        winston.info(Report.SEPARATOR);
        winston.info("                SSL METHODS");
        winston.info(Report.SEPARATOR);
        winston.info(format("Date: %s", new Date()));
        winston.info(format("Host: '%s'", sslMethodChecker.host));
        winston.info(format("Port: '%d'", sslMethodChecker.port));
        winston.info(format("SSL Methods to test: '%s'", Object.values(SSL_METHOD).join(", ")));
        winston.info(Report.SEPARATOR);
    }

    writeSummary(sslMethodChecker: SSLMethodChecker) {
        super.writeSummary(sslMethodChecker);
        const results = sslMethodChecker.results;
        let methods = results.filter(m => { return m.isAllowed || m.errorMessage !== ""; })
            .map(m => { return (m.errorMessage !== "") ? format("%s (%s)", m.sslMethod, m.errorMessage) : m.sslMethod; })
            .join(", ");
        if (methods === "") {
            methods = "Insecure connection: no SSL methods identified"
        }
        winston.info(Report.SEPARATOR);
        winston.info(format("Execution time: %s", this._executionTime));
        winston.info(format("SSL Methods: '%s'", methods));
        winston.info(Report.SEPARATOR);
    }
}