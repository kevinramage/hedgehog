import { CertificateChecker } from "../../../checker/certificate/certificateChecker";
import { Report } from "./report";

import * as winston from "winston";
import { format } from "util";
import { CertificateCheckerBusiness } from "../checker/certificateChecker";

export class CertificateReport extends Report {

    writeRequest(certificateChecker: CertificateCheckerBusiness) {
        super.writeRequest(certificateChecker);

        winston.info(Report.SEPARATOR);
        winston.info("                " + CertificateChecker.NAME);
        winston.info(Report.SEPARATOR);
        winston.info(format("Date: %s", new Date()));
        winston.info(format("Host: '%s'", certificateChecker.host));
        winston.info(format("Port: '%s'", certificateChecker.port));
        winston.info(Report.SEPARATOR);
    }

    writeSummary(certificateChecker: CertificateCheckerBusiness) {
        super.writeSummary(certificateChecker);
        const certificateChain = certificateChecker.result.certificateChain.reverse().map((value, index) => {
            return "* " + ("  ").repeat(index) + value;
        });
        winston.info(Report.SEPARATOR);
        winston.info(format("Execution time: %s", this._executionTime));
        winston.info(format("Certification chain"));
        certificateChain.forEach(certificate => {
            winston.info(certificate);
        });
        winston.info(format("Expiration: '%s'", certificateChecker.result.isNotExpired ? "NOT EXPIRED" : "EXPIRED"));
        winston.info(format("Common name: '%s'", certificateChecker.result.isCommonNameValid ? "VALID" : "INVALID"));
        winston.info(Report.SEPARATOR);
    }
}