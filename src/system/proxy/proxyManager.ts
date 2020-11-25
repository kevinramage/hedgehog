import { Response } from "../../common/business/response";
import { Header, HEADER_NAME } from "../../common/business/header";
import { Request } from "../../common/business/request";
import { Proxy } from "./http-mitm-proxy";

import * as URL from "url";
const MITM = require('http-mitm-proxy');

export type OnResponseReceivedHandler = (request: Request, response: Response) => void;

export class ProxyManager {

    private _port : number;
    private _handlers : OnResponseReceivedHandler[];

    constructor(port: number) {
        this._port = port;
        this._handlers = []; 
    }

    public onResponseReceived(handler: OnResponseReceivedHandler) {
        this._handlers.push(handler);
    }
    
    public async run() {
        const proxy = new MITM();
        proxy.onWebSocketConnection((socket:any) => { console.info("connection"); console.info(socket); });
        proxy.onRequest(this.onRequest.bind(this));
        proxy.onError((ctx: any, err: any) => {
            //console.info(err);
        });
        proxy.listen({port: this.port}, () => {});
    }

    private onRequest(ctx: any, callback: Function) {
        const instance = this;
        
        // Use gunzip
        ctx.use(MITM.gunzip);

        // Collect url and headers
        var body = null;
        const chunks : any[] = [];

        // Handlers
        ctx.onRequestData((ctx: any, chunk: any, callback: Function) => { chunks.push(chunk); return callback(null, chunk); });
        ctx.onRequestEnd((ctx: any, callback: Function) => {
            //const requestHeaders = instance.convertHeaders(headers);
            body = (Buffer.concat(chunks)).toString();
            ctx.clientToProxyRequest.request = instance.createRequest(ctx.clientToProxyRequest, body);

            return callback();
        });

        ctx.onResponse(this.onResponse.bind(this));

        return callback();
    }

    private onResponse(ctx: any, callback:Function) {
        const instance = this;
        const statusCode = ctx.serverToProxyResponse.statusCode;
        const headers = ctx.serverToProxyResponse.headers;
        const chunks : any[] = [];
        
        // Collect response data
        ctx.onResponseData((ctx: any, chunk: any, callback: Function) => { 
            chunks.push(chunk); 
            return callback(null, chunk); 
        });

        ctx.onResponseEnd((ctx: any, callback: Function) => {
            
            // Collect request and response objects
            const body = (Buffer.concat(chunks)).toString();
            const request = ctx.clientToProxyRequest.request;
            const response = instance.createResponse(statusCode, headers, body);

            // Call handlers
            instance._handlers.forEach(handler => { handler(request, response); })
            
            return callback();
        });

        return callback();
    }

    private convertHeaders(headers: any) {
        const headersFormatted : Header[] = [];
        const keys = Object.keys(headers);
        keys.forEach(k => {
            const header = new Header(k, headers[k]);
            headersFormatted.push(header);
        });
        return headersFormatted;
    }

    private createRequest(clientToProxyRequest: any, body: string) {

        ///TODO To change clientToProxyRequest.url is a path and not an url
        const urlInfo = URL.parse(clientToProxyRequest.url);

        // Get headers and search host header
        const headers = this.convertHeaders(clientToProxyRequest.headers);
        var host = "";
        const hostHeader = headers.find(h => { return h.key == HEADER_NAME.HOST });
        if ( hostHeader && hostHeader.value ) {
            host = hostHeader.value as string;
        }

        ///TODO - Change the way to identify the port
        ///TODO - Change the way to identify the protocol
        const request = new Request(host, clientToProxyRequest.isSSL ? 443: 80, clientToProxyRequest.method, urlInfo.path as string);
        request.protocol = clientToProxyRequest.isSSL ? "https" : "http";
        request.headers = headers;
        request.body = body;
        request.httpVersion = clientToProxyRequest.httpVersion;
        return request;
    }

    private createResponse(status: number, headers: Header[], body: string) {
        const response = new Response(status, body);
        response.headers = this.convertHeaders(headers);
        return response;
    }

    public get port() {
        return this._port;
    }
}