export class MethodResult {
    public httpMethod : string;
    public isListening : boolean;
    public errorMessage : string;

    public constructor(httpMethod: string, isListening: boolean, errorMessage: string) {
        this.httpMethod = httpMethod;
        this.isListening = isListening;
        this.errorMessage = errorMessage;
    }
}