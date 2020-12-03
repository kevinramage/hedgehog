import { IChecker } from "../IChecker";
import { Request, REQUEST_METHODS } from "../../common/business/request/request";
import { ICertificate } from "../../common/business/request/certificate";
import { CertificateResult } from "./certificateResult";
import { DomainUtils } from "../../common/utils/domainUtils";
import { Report } from "../../common/business/report/report";
import { CertificateReport } from "../../common/business/report/certificateReport";


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
            this._report.writeRequest(this);
            this._result = await this.runQuery();
            this._report.writeSummary(this);
            resolve();
        });
    }

    // Manage certication chain simple PKI and multiple PKI
    private runQuery() {
        return new Promise<CertificateResult>(async (resolve) => {
            const request = new Request(this._host, this._port, REQUEST_METHODS.GET, "/");
            request.ssl = true;
            const response = await request.send();
            const certificate = response.certificate as ICertificate;
            const result = new CertificateResult();
            result.certificateChain = this.getCertificateChain(certificate);
            result.isNotExpired = this.checkCertificateExpiration(certificate, "");
            result.isCommonNameValid = this.checkCommonName(certificate, this._host);
            resolve(result);
        });

    }

    private getCertificateChain(certificate : ICertificate) {
        return [certificate.subject.CN].concat(this.getIssuersChain(certificate));
    }

    private getIssuersChain(certificate: ICertificate) {
        const issuers : string[] = [];
        let currentCN = "";
        let currentCerificate = certificate;
        while (currentCerificate && currentCerificate.issuer && currentCerificate.issuer.CN && currentCN !== currentCerificate.issuer.CN) {
            currentCN = currentCerificate.issuer.CN;
            currentCerificate = currentCerificate.issuerCertificate;
            issuers.push(currentCN);
        }
        return issuers;
    }

    private checkCertificateExpiration(certificate: ICertificate, previousCN: string) : boolean {

        if (certificate && certificate.issuer && certificate.issuer.CN && certificate.issuer.CN !== previousCN) {
            const currentDate = new Date().getTime();
            const validFrom = new Date(certificate.valid_from).getTime();
            const validTo = new Date(certificate.valid_to).getTime();
            const isCertificateValid = currentDate >= validFrom && currentDate <= validTo;
            const nextCertificate = certificate.issuerCertificate;
            return isCertificateValid && this.checkCertificateExpiration(nextCertificate, certificate.issuer.CN);

        } else {
            return true;
        }
    }

    private getAlternativeNames(alternativeNameArg: string) {
        return alternativeNameArg.split(",").map(san => { return san.trim().substr(("DNS:").length) })
    }

    private checkCommonName(certificate: ICertificate, host: string) {
        let isValidCommonName = false;

        // Common name
        if (certificate && certificate.subject && certificate.subject.CN) {
            isValidCommonName = DomainUtils.isIncludedInCommonName(certificate.subject.CN, host);
        }

        // Alternative names
        if (certificate && certificate.subjectaltname) {
            const alternativesName = this.getAlternativeNames(certificate.subjectaltname);
            alternativesName.forEach((alternativeName) => {
                isValidCommonName = isValidCommonName || DomainUtils.isIncludedInCommonName(alternativeName, host);
            });
        }

        return isValidCommonName;
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