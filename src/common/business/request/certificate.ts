import { ICertificateIdentfy } from "./certificateIdentity";

export interface ICertificate {
    valid_from: string;
    valid_to: string;
    subject: ICertificateIdentfy;
    issuer: ICertificateIdentfy;
    issuerCertificate: ICertificate;
    subjectaltname ?: string;
}