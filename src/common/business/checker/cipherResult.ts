import { PayloadResultType } from "../test/payloadResult";

export class CipherResult {
    private _cipher : string;
    private _category : string;
    private _isListening : boolean;
    private _errorMessage : string;
    private _status : PayloadResultType;


    constructor(cipher: string, category: string, isListening: boolean, errorMessage: string) {
        this._cipher = cipher;
        this._category = category;
        this._isListening = isListening;
        this._errorMessage = errorMessage;
        this._status = "NOT_DEFINED";
    }

    public get cipher() {
        return this._cipher;
    }

    public get category() {
        return this._category;
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