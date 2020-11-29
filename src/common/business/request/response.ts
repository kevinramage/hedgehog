import { StringUtils } from "../../utils/stringUtils";
import { Header, HEADER_NAME } from "./header";

/**
 * HTTP Response
 */
export class Response {
    private _status: number | undefined;
    private _headers: Header[];
    private _body: string | undefined;

    /**
     * Constructor
     * @param status response status
     * @param body response body
     */
    constructor(status: number, body: string) {
        this._status = status;
        this._body = body;
        this._headers = [];
    }

    /**
     * Add header to this response
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
     * Get response content-type header
     */
    public get contentType() {
        return this.getHeaderValue(HEADER_NAME.CONTENTTYPE) as string;
    }

    /**
     * Get response location header
     */
    public get location() {
        return this.getHeaderValue(HEADER_NAME.LOCATION) as string;
    }

    /**
     * Get response access-control-allow-origin header
     */
    public get accessControlAllowOrigin() {
        return this.getHeaderValue(HEADER_NAME.ACCESSCONTROLALLOWORIGIN) as string;
    }

    /**
     * Get response cache-control header
     */
    public get cacheControl() {
        return this.getHeaderValue(HEADER_NAME.CACHECONTROL) as string;
    }

    /**
     * Get response eTag header
     */
    public get eTag() {
        return this.getHeaderValue(HEADER_NAME.ETAG) as string;
    }

    /**
     * Get response feature-policy header
     */
    public get featurePolicy() {
        return this.getHeaderValue(HEADER_NAME.ETAG) as string;
    }

    public get status() {
        return this._status;
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

    public get inlineBody() {
        return this._body?.replace(/\r/g, "").replace(/\n/g, "") || "";
    }

    public get isHtmlResponse() {
        const contentTypeHeader = this.contentType;
        if (contentTypeHeader) {
            return contentTypeHeader && StringUtils.containsOneOf(contentTypeHeader, ["text/html", "application/xhtml+xml"]);
        } else {
            return false;
        }
    }
}