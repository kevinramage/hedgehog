import * as winston from "winston";
import { IBaseScoreMetrics } from "../baseScoreMetrics";
import { TestExecutor } from "../testExecutor";

import BASESCOREMETRICS = require("../../../../config/cvss/baseScoreMetricsCertificate.json");
import { CertificateResult } from "../../checker/certificateResult";
import { ICertificateDescription } from "../description/certificateDescription";
import { readFileSync } from "fs-extra";
import { CertificateCheckerBusiness } from "../../checker/certificateChecker";
import { Evaluator } from "../../evaluator";

export class CertificateExecutor extends TestExecutor {
    private _host: string;
    private _port: number;
    private _result?: CertificateResult;

    constructor() {
        super();
        this._host = "";
        this._port = 0;
        this._fixComplexity = "medium";
        this._baseScoreMetrics = BASESCOREMETRICS as IBaseScoreMetrics;
        this._templateFileName = "resources/template/test/CertificateTemplate.html";
    }

    init() {

        // Read test
        const test = this.testDescription.test as ICertificateDescription;
        this._host = test.host;
        this._port = test.port;
        if (!this._port) {
            this._port = 443;
        }

        // Read report template
        const buffer = readFileSync(this._templateFileName);
        this._reportTemplate = buffer.toString();
    }

    execute() {
        return new Promise<void>(async (resolve) => {

            // Run method listener
            const certificateChecker = new CertificateCheckerBusiness(this._host, this._port);
            await certificateChecker.run();

            // Collect results
            this._result = certificateChecker.result;
            const validCertificate = this._result.isNotExpired && this._result.isCommonNameValid;
            this._status = validCertificate ? "NOT_INJECTED" : "INJECTED";

            resolve();
        });
    }

    writeReport() {
        winston.debug("CipherListenerExecutor.writeReport");
        this.initReportingVariables();

        // Checks injected
        const checksInjectedLengthKey = "execution.checksInjectedLength";
        const checksInjectedLength = (this._result?.isCommonNameValid ? 0 : 1) + (this._result?.isNotExpired ? 0 : 1);
        this.reportingVariables[checksInjectedLengthKey] = checksInjectedLength;

        // Expiration
        const expirationStatusClassKey = "execution.expirationStatusClass";
        const expirationStatusKey = "execution.expirationStatus";
        this.reportingVariables[expirationStatusClassKey] = this._result?.isNotExpired ? "SUCCESS" : "FAILED";
        this.reportingVariables[expirationStatusKey] = this._result?.isNotExpired ? "OK" : "EXPIRED";

        // Common name
        const commonNameStatusClassKey = "execution.commonNameStatusClass";
        const commonNameStatusKey = "execution.commonNameStatus";
        this.reportingVariables[commonNameStatusClassKey] = this._result?.isCommonNameValid ? "SUCCESS" : "FAILED";
        this.reportingVariables[commonNameStatusKey] = this._result?.isCommonNameValid ? "OK" : "KO";

        return Evaluator.evaluate(this.reportingVariables, this._reportTemplate);
    }

    public static get executorName() {
        return "CertificateExecutor";
    }
}