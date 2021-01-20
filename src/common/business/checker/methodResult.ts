import { PayloadResultType } from "../test/payloadResult";

export class MethodResult {
    private _httpMethod : string;
    private _isListening : boolean;
    private _errorMessage : string;
    private _status : PayloadResultType;

    public constructor(httpMethod: string, isListening: boolean, errorMessage: string) {
        this._httpMethod = httpMethod;
        this._isListening = isListening;
        this._errorMessage = errorMessage;
        this._status = "NOT_DEFINED";
    }

    public get httpMethod() {
        return this._httpMethod;
    }

    public get isListening() {
        return this._isListening;
    }

    public get errorMessage() {
        return this._errorMessage;
    }

    public get status() {
        return this._status;
    }

    public set status(value) {
        this._status = value;
    }
}