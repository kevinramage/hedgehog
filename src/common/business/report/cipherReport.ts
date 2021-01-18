import { Report } from "./report";
import * as winston from "winston";
import { format } from "util";
import { CipherChecker } from "../../../checker/cipher/cipherChecker";
import { CipherListener } from "../checker/cipherListener";

export class CipherReport extends Report {

    writeRequest(cipherChecker: CipherListener) {
        super.writeRequest(cipherChecker);

        winston.info(Report.SEPARATOR);
        winston.info("                CIPHERS");
        winston.info(Report.SEPARATOR);
        winston.info(format("Date: %s", new Date()));
        winston.info(format("Host: '%s'", cipherChecker.host));
        winston.info(format("Port: '%d'", cipherChecker.port));
        winston.info(format("Path: '%s'", cipherChecker.path));
        // winston.info(format("Ciphers to test: '%s'", cipherChecker.ciphersToTest.join(":")));
        winston.info(Report.SEPARATOR);
    }

    writeSummary(cipherChecker: CipherListener) {
        super.writeSummary(cipherChecker);

        const ciphersAvailable = cipherChecker.results.filter(c => { return c.isListening; })
            .map(c => { return format("%s(%s)", c.cipher, c.category)}).join(", ");

        const cipherRecommended = cipherChecker.results.filter(c => { return c.category === "Recommended"; });
        const cipherSecure = cipherChecker.results.filter(c => { return c.category === "Secure"; });
        const cipherWeak = cipherChecker.results.filter(c => { return c.category === "Weak"; });
        const cipherInsecure = cipherChecker.results.filter(c => { return c.category === "Insecure"; });

        const cipherRecommendedAvailable = cipherRecommended.filter(c => { return c.isListening; }).length;
        const cipherSecureAvailable = cipherSecure.filter(c => { return c.isListening; }).length;
        const cipherWeakAvailable = cipherWeak.filter(c => { return c.isListening; }).length;
        const cipherInsecureAvailable = cipherInsecure.filter(c => { return c.isListening; }).length;

        winston.info(Report.SEPARATOR);
        winston.info(format("Execution time: %s", this._executionTime));
        winston.info(format("Cipher category recommended: %d / %d", cipherRecommendedAvailable, cipherRecommended.length));
        winston.info(format("Cipher category secure: %d / %d", cipherSecureAvailable, cipherSecure.length));
        winston.info(format("Cipher category weak: %d / %d", cipherWeakAvailable, cipherWeak.length));
        winston.info(format("Cipher category insecure: %d / %d", cipherInsecureAvailable, cipherInsecure.length));
        winston.info(Report.SEPARATOR);
        winston.info(format("Ciphers authorized: %s", ciphersAvailable));
        winston.info(Report.SEPARATOR);
    }

}