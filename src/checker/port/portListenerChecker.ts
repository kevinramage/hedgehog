import * as net from "net";
import { ResultItem } from "../../common/business/resultItem";
import { IChecker } from "../IChecker";

/**
 * Checker to analyze the server port allowed
 * ///TODO Refacto
 */
export class PortListenerChecker implements IChecker {

    private _host : string;
    private _port : number;

    /**
     * Constructor
     * @param host host to test
     * @param port port to test
     * @param expectedStatus array of possible response status code for invalid path (e.g 404, 405)
     */
    constructor(host: string, port: number) {
        this._host = host;
        this._port = port;
    }

    run(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    check() {
        return new Promise<PortListenerResultItem>((resolve) => {
            const result = new PortListenerResultItem();
            result.host = this._host;
            result.port = this._port;
            var responseProvided = false;
            const socket = net.connect(this._port, this._host);
            socket.on("connect", () => {
                responseProvided = true;
                result.isListening = true;
                socket.destroy();
                resolve(result);
            });
            socket.on("error", () => {
                responseProvided = true;
                socket.destroy();
                resolve(result);
            });
        });       
    }

    public static fromArgs(content: string) {
        return null;
    }
}

export class PortListenerResultItem extends ResultItem {
    public host : string;
    public port : number;
    public isListening: boolean;

    constructor() {
        super();
        this.host = "";
        this.port = -1;
        this.isListening = false;
    }
}