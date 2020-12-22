import { format } from "util";

/**
 * HTTP header
 */
export class Header {
    private _key: string;
    private _value: string | string[];

    /**
     * Constructor
     * @param key header key - Header key is case insensitive (RFC-4485), store in lower case
     * @param value header value
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

    /**
     * Format the header
     */
    public toString() {
        return format("%s: %s", this.key, this.value);
    }
}

/**
 * Headers name (request and response)
 */
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
    FEATUREPOLICY = "feature-policy",
    PROXYAUTHORIZATION = "proxy-authorization",
    CONTENTSECURITYPOLICY = "content-security-policy",
    XCONTENTSECURITYPOLICY = "x-content-security-policy",
}