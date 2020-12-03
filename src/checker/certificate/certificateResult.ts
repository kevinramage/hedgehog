export class CertificateResult {
    public certificateChain : string[];
    public isNotExpired : boolean;
    public isCommonNameValid : boolean;

    constructor() {
        this.certificateChain = [];
        this.isNotExpired = false;
        this.isCommonNameValid = false;
    }
}