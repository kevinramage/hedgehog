export class FuzzingResult {
    public path : string;
    public isExposed : boolean;
    public errorMessage : string;

    constructor(path: string, isExposed: boolean, errorMessage: string) {
        this.path = path;
        this.isExposed = isExposed;
        this.errorMessage = errorMessage;
    }
}