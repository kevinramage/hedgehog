import { IChecker } from "../IChecker";
import { CertificateResult } from "../../common/business/checker/certificateResult";
import { Report } from "../../common/business/report/report";
import { CertificateReport } from "../../common/business/report/certificateReport";
import { CertificateCheckerBusiness } from "../../common/business/checker/certificateChecker";


/**
 * Checker to analyze the server certificate and analyze it
 * Several certificate type (DV, OV, EV)
 * Domain Validation (DV)
 * Organization Validation (OV)
 * Extended Validation (EV)
 */
export class CertificateChecker implements IChecker {

    public static NAME = "CertificateChecker";
    private _host : string;
    private _port : number;
    private _report : Report;
    private _result ?: CertificateResult;

    constructor(host: string, port: number) {
        this._host = host;
        this._port = port;
        this._report = new CertificateReport();
    }

    /**
     * Run the execution of the checker
     */
    public run(): Promise<void> {
        return new Promise<void>(async (resolve) => {

            const certificateCheckerBusiness = new CertificateCheckerBusiness(this.host, this.port, new CertificateReport());
            await certificateCheckerBusiness.run();

            this._result = certificateCheckerBusiness.result;

            resolve();
        });
    }


    public get host() {
        return this._host;
    }

    public get port() {
        return this._port;
    }

    public get result() {
        return this._result as CertificateResult;
    }

    public static fromArgs(content: string) {
        return null;
    }
}