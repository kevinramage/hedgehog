export class CipherResult {
    public cipher : string;
    public category : string;
    public isListening : boolean;
    public errorMessage : string;

    constructor(cipher: string, category: string, isListening: boolean, errorMessage: string) {
        this.cipher = cipher;
        this.category = category;
        this.isListening = isListening;
        this.errorMessage = errorMessage;
    }
}