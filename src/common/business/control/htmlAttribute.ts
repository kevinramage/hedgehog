import { v4 } from "uuid";

export class HtmlAttribute {
    private _id : string;
    private _key : string | null;
    private _value : string | null;
    private _html : string | null;

    constructor(key: string | null, value: string | null, html: string | null) {
        this._id = v4();
        this._key = key;
        this._value = value;
        this._html = html;
    }

    public get id() {
        return this._id;
    }
    public get key() {
        return this._key;
    }
    public get value() {
        return this._value;
    }
    public get html() {
        return this._html;
    }
}