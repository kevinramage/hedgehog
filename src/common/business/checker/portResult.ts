import { PayloadResultType } from "../test/payloadResult";

export class PortResult {
    private _port : number;
    private _isListening : boolean;
    private _status : PayloadResultType;

    constructor(port: number, isListening: boolean) {
        this._port = port;
        this._isListening = isListening;
        this._status = "NOT_DEFINED";
    }

    public get port() {
        return this._port;
    }

    public get isListening() {
        return this._isListening;
    }

    public get status() {
        return this._status;
    }

    public set status(value) {
        this._status = value;
    }
}