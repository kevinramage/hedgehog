export class PortResult {
    public port : number;
    public isListening : boolean;

    constructor(port: number, isListening: boolean) {
        this.port = port;
        this.isListening = isListening;
    }
}