export class CertificateResult {
    private _certificateChain : string[];
    private _isNotExpired : boolean;
    private _isCommonNameValid : boolean;

    constructor() {
        this._certificateChain = [];
        this._isNotExpired = false;
        this._isCommonNameValid = false;
    }

    public get certificateChain(){
        return this._certificateChain;
    }

    public set certificateChain(value) {
        this._certificateChain = value;
    }

    public get isNotExpired() {
        return this._isNotExpired;
    }

    public set isNotExpired(value) {
        this._isNotExpired = value;
    }

    public get isCommonNameValid() {
        return this._isCommonNameValid;
    }

    public set isCommonNameValid(value) {
        this._isCommonNameValid = value;
    }
}