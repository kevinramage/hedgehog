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

export namespace HEADER_NAME {
    export const HOST = "host";
    export const CONTENTTYPE = "content-type";
    export const LOCATION = "location";
    export const SERVER = "server";
    export const XASPNETVERSION = "x-aspnet-version";
    export const XASPNETMVCVERSION = "x-aspNetmvc-version";
    export const XPOWEREDBY = "x-powered-by";
    export const ACCESSCONTROLALLOWORIGIN = "access-control-allow-origin";
    export const CACHECONTROL = "cache-control";
    export const ETAG = "etag";
    export const FEATUREPOLICY = "feature-policy";
}