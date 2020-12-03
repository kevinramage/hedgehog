export interface ICertificateIdentfy {
    C: string;
    ST: string;
    L: string;
    O: string;
    OU: string;
    CN: string;
    serialNumber?: string;
    businessCategory?: string;
    jurisdictionST?: string;
    jurisdictionC?: string;
}