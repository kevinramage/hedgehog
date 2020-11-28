export class SSLMethodResult {
    public sslMethod : string;
    public isAllowed : boolean;
    public errorMessage : string;

    constructor(sslMethod: string, isAllowed: boolean, errorMessage: string) {
        this.sslMethod = sslMethod;
        this.isAllowed = isAllowed;
        this.errorMessage = errorMessage;
    }
}