import { PayloadResultType } from "../test/payloadResult";

export class SSLMethodResult {
    private _sslMethod : string;
    private _isAllowed : boolean;
    private _errorMessage : string;
    private _status : PayloadResultType;

    constructor(sslMethod: string, isAllowed: boolean, errorMessage: string) {
        this._sslMethod = sslMethod;
        this._isAllowed = isAllowed;
        this._errorMessage = errorMessage;
        this._status = "NOT_DEFINED";
    }

    public get sslMethod() {
        return this._sslMethod;
    }

    public get isAllowed() {
        return this._isAllowed;
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