export class Extract {
    private _name: string;
    private _extractType: string;
    private _extractRegex: string;
    private _extractFlags: string;

    constructor() {
        this._name = "";
        this._extractType = "";
        this._extractRegex = "";
        this._extractFlags = "g";
    }

    public evaluate(responseBody: string) {
        switch (this.extractType) {
            case "ResponseBody":
                return this.evaluateResponse(responseBody);

            default:
                throw new Error("Invalid extract type: " + this.extractType);
        }
    }

    private evaluateResponse(responseBody: string) {
        let result = null;
        const regex = new RegExp(this.extractRegex, this.extractFlags);
        const matchs = regex.exec(responseBody);
        if (matchs && matchs.length > 1) {
            result = matchs[1];
        }
        return result;
    }

    public clone() {
        const newExtract = new Extract();
        newExtract.name = this.name;
        newExtract.extractType = this.extractType;
        newExtract.extractRegex = this.extractRegex;
        newExtract.extractFlags = this.extractFlags;
        return newExtract;
    }

    public get name() {
        return this._name;
    }

    public set name(value) {
        this._name = value;
    }

    public get extractType() {
        return this._extractType;
    }

    public set extractType(value) {
        this._extractType = value;
    }

    public get extractRegex() {
        return this._extractRegex;
    }

    public set extractRegex(value) {
        this._extractRegex = value;
    }

    public get extractFlags() {
        return this._extractFlags;
    }

    public set extractFlags(value) {
        this._extractFlags = value;
    }
}