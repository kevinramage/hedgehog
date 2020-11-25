import { RequestUtil } from "../utils/requestUtil";
import { Header, HEADER_NAME } from "./header";

export class Request {
    private _protocol ?: string;
    private _httpVersion ?: string;
    private _host : string;
    private _port : number;
    private _method : string;
    private _url: string;
    private _path : string;
    private _headers : Header[];
    private _body : string | undefined;
    private _followRedirect : boolean;

    constructor(host: string, port: number, method: string, path: string) {
        this._host = host;
        this._port = port;
        this._method = method;
        this._path = path;
        this._headers = [];
        this._followRedirect = true;
        this._url = "";
    }

    public addHeader(key: string, value: string | string[]) {
        this._headers.push(new Header(key, value));
    }

    public cleanHeaders() {
        this._headers = [];
    }

    public send() {
        return RequestUtil.sendRequest(this, 0);
    }

    public getHeader(headerName: string) {
        return this.headers.find(h => { return h.key == headerName.toLowerCase() });
    }

    public getHeaderValue(headerName: string) {
        const header = this.headers.find(h => { return h.key == headerName.toLowerCase() });
        if ( header ) {
            return header.value;
        } else {
            return undefined;
        }
    }

    public get hostHeader() {
        return this.getHeaderValue(HEADER_NAME.HOST) as string;
    }

    public get host() {
        return this._host;
    }

    public get port() {
        return this._port;
    }

    public get method() {
        return this._method;
    }

    public get url() {
        return this._url;
    }

    public set url(value) {
        this._url = value;
    }

    public get path() {
        return this._path;
    }

    public set path(value) {
        this._path = value;
    }

    public get headers() {
        return this._headers;
    }

    public set headers(value) {
        this._headers = value;
    }

    public get body() {
        return this._body;
    }

    public set body(value) {
        this._body = value;
    }

    public get followRedirect() {
        return this._followRedirect;
    }

    public set followRedirect(value) {
        this._followRedirect = value;
    }

    public get protocol() {
        return this._protocol;
    }

    public set protocol(value) {
        this._protocol = value;
    }

    public get httpVersion() {
        return this._httpVersion;
    }

    public set httpVersion(value) {
        this._httpVersion = value;
    }
}

/**
 * Request methods
 * RFC 7231 + RFC 5789
 * By convention, standardized methods are defined in all-uppercase US-ASCII letters.
 */
export module REQUEST_METHODS {
    export const GET = "GET";
    export const HEAD = "HEAD";
    export const POST = "POST";
    export const PUT = "PUT";
    export const DELETE = "DELETE";
    export const CONNECT = "CONNECT";
    export const OPTIONS = "OPTIONS";
    export const TRACE = "TRACE";
    export const PATCH = "PATCH";
}