import { format } from "util";

export class Header {
    private _key: string;
    private _value: string | string[];

    /**
     * Constructor
     * @param key header key
     * @param value header value
     * Header name is case insensitive (RFC-4485)
     */
    constructor(key: string, value: string | string[]) {
        this._key = key.toLowerCase();
        this._value = value;
    }

    public get key() {
        return this._key;
    }

    public get value() {
        return this._value;
    }

    public toString() {
        return format("%s: %s", this.key, this.value);
    }
}

export enum HEADER_NAME {
    HOST = "host",
    CONTENTTYPE = "content-type",
    LOCATION = "location",
    SERVER = "server",
    XASPNETVERSION = "x-aspnet-version",
    XASPNETMVCVERSION = "x-aspNetmvc-version",
    XPOWEREDBY = "x-powered-by",
    ACCESSCONTROLALLOWORIGIN = "access-control-allow-origin",
    CACHECONTROL = "cache-control",
    ETAG = "etag",
    FEATUREPOLICY = "feature-policy"
}