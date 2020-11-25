import { v4 } from "uuid";

export class HtmlAttribute {
    private _id : string;
    private _key ?: string;
    private _value ?: string;
    private _html ?: string;

    constructor(key: string, value: string, html: string) {
        this._id = v4();
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