import { RequestUtil } from "../../utils/requestUtil";
import { Evaluator } from "../evaluator";
import { Extract } from "../test/extract";
import { Header, HEADER_NAME } from "./header";

/**
 * HTTP Request
 */
export class Request {
    private _protocol ?: string;
    private _httpVersion ?: string;
    private _host : string;
    private _ssl : boolean;
    private _port : number;
    private _method : string;
    private _url: string;
    private _path : string;
    private _headers : Header[];
    private _body : string | undefined;
    private _followRedirect : boolean;
    private _startDateTime ?: Date;
    private _proxyServer ?: string;
    private _proxyPort ?: number;
    private _proxyUsername ?: string;
    private _proxyPassword ?: string;
    private _extracts : Extract[];

    /**
     * Constructor
     * @param host request host
     * @param port request port
     * @param method request method
     * @param path request path
     */
    constructor(host: string, port: number, method: string, path: string) {
        this._host = host;
        this._port = port;
        this._method = method;
        this._path = path;
        this._headers = [];
        this._followRedirect = true;
        this._url = "";
        this._ssl = false;
        this._extracts = [];
    }

    /**
     * Add header to this request
     * @param key header key
     * @param value header value
     */
    public addHeader(key: string, value: string | string[]) {
        this._headers.push(new Header(key, value));
    }

    /**
     * Remove all request headers
     */
    public cleanHeaders() {
        this._headers = [];
    }

    /**
     * Search an header from its name
     * @param headerName header name to search (case insensitive)
     */
    public getHeader(headerName: string) {
        return this.headers.find(h => { return h.key === headerName.toLowerCase() });
    }

    /**
     * Search an header value from its name
     * @param headerName header name to search (case insensitive)
     */
    public getHeaderValue(headerName: string) {
        const header = this.headers.find(h => { return h.key === headerName.toLowerCase() });
        if (header) {
            return header.value;
        } else {
            return undefined;
        }
    }

    /**
     * Get request host header
     */
    public get hostHeader() {
        return this.getHeaderValue(HEADER_NAME.HOST) as string;
    }

    /**
     * Send a request and wait the response
     * @returns a promise of response
     */
    public send() {
        this._startDateTime = new Date();
        return RequestUtil.sendRequest(this, 0);
    }

    public clone() {
        const newRequest = new Request(this.host, this.port, this.method, this.path);
        newRequest.headers = Header.cloneHeaders(this.headers);
        newRequest.body = this.body;
        newRequest.proxyServer = this.proxyServer;
        newRequest.proxyPort = this.proxyPort;
        newRequest.proxyUsername = this.proxyUsername;
        newRequest.proxyPassword = this.proxyPassword;
        newRequest._extracts = this.extracts.map(e => { return e.clone(); })
        return newRequest;
    }

    public evaluate(variables: {[key: string]: string}) {
        this._host = Evaluator.evaluate(variables, this.host);
        this._method = Evaluator.evaluate(variables, this.method);
        this._path = Evaluator.evaluate(variables, this.path);
        if (this.body) {
            this._body = Evaluator.evaluate(variables, this.body);
        }
        Header.evaluateHeaders(variables, this.headers);
    }

    public addExtract(extract: Extract) {
        this._extracts.push(extract);
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

    public get ssl() {
        return this._ssl;
    }

    public set ssl(value) {
        this._ssl = value;
    }

    public get startDateTime() {
        return this._startDateTime as Date;
    }

    public get proxyServer() {
        return this._proxyServer;
    }

    public set proxyServer(value) {
        this._proxyServer = value;
    }

    public get proxyPort() {
        return this._proxyPort;
    }

    public set proxyPort(value) {
        this._proxyPort = value;
    }

    public get proxyUsername() {
        return this._proxyUsername;
    }

    public set proxyUsername(value) {
        this._proxyUsername = value;
    }

    public get proxyPassword() {
        return this._proxyPassword;
    }

    public set proxyPassword(value) {
        this._proxyPassword = value;
    }

    public get extracts() {
        return this._extracts;
    }

    public static instanciateFromUrl(urlString: string, method: string) {
        const url = new URL(urlString);
        const path = url.pathname + url.search;
        const request = new Request(url.hostname, Number.parseInt(url.port, 10), method, path);
        request.protocol = url.protocol.substr(0, url.protocol.length - 1);
        request.ssl = (request.protocol === "https");
        return request;
    }
}

/**
 * Request methods
 * RFC 7231 + RFC 5789
 * By convention, standardized methods are defined in all-uppercase US-ASCII letters.
 */
export enum REQUEST_METHODS {
    GET = "GET",
    HEAD = "HEAD",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    CONNECT = "CONNECT",
    OPTIONS = "OPTIONS",
    TRACE = "TRACE",
    PATCH = "PATCH"
}