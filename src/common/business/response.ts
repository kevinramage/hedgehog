import { StringUtils } from "../utils/StringUtils";
import { Header, HEADER_NAME } from "./header";

export class Response {
    private _status: number | undefined;
    private _headers: Header[];
    private _body: string | undefined;

    constructor(status: number, body: string) {
        this._status = status;
        this._body = body;
        this._headers = [];
    }

    public addHeader(key: string, value: string | string[]) {
        this._headers.push(new Header(key, value));
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

    public get contentType() {
        return this.getHeaderValue(HEADER_NAME.CONTENTTYPE) as string;
    }

    public get location() {
        return this.getHeaderValue(HEADER_NAME.LOCATION) as string;
    }

    public get accessControlAllowOrigin() {
        return this.getHeaderValue(HEADER_NAME.ACCESSCONTROLALLOWORIGIN) as string;
    }

    public get cacheControl() {
        return this.getHeaderValue(HEADER_NAME.CACHECONTROL) as string;
    }

    public get eTag() {
        return this.getHeaderValue(HEADER_NAME.ETAG) as string;
    }

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
        if ( contentTypeHeader ) {
            return contentTypeHeader && StringUtils.containsOneOf(contentTypeHeader, ["text/html", "application/xhtml+xml"]);
        } else {
            return false;
        }
    }
}