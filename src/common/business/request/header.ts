import { format } from "util";
import { Evaluator } from "../evaluator";

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

    /**
     * Format the header
     */
    public toString() {
        return format("%s: %s", this.key, this.value);
    }

    public clone() {
        return new Header(this.key, this.value);
    }

    public evaluate(variables: {[key: string]: string}) {
        this._key = Evaluator.evaluate(variables, this.key);
        if (this.value && typeof this.value === "object" && this.value.length !== undefined) {
            const array = this.value as string[];
            array.map(i => { return Evaluator.evaluate(variables, i); })
        } else if (this.value) {
            this._value = Evaluator.evaluate(variables, this.value.toString());
        }
    }

    public get key() {
        return this._key;
    }

    public get value() {
        return this._value;
    }



    public static cloneHeaders(headers: Header[]) {
        const newHeaders : Header[] = [];
        headers.forEach(h => { newHeaders.push(h.clone()); })
        return newHeaders;
    }

    public static evaluateHeaders(variables: {[key: string]: string}, headers: Header[]) {
        if (headers) {
            headers.forEach(h => { return h.evaluate(variables); })
        }
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
    CONTENTLENGTH = "content-length",
    SETCOOKIE = "set-cookie"
}