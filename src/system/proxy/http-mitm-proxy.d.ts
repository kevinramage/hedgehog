import * as http from "http";
import * as https from "https";
import { Socket } from "net";

export type Proxy = {
    listen(options: ListenOptions, callback ?: Function) : Proxy;
    close() : Proxy;
    onError(handler: Function) : void;
    onRequest(handler: Function) : void;
}

export interface ListenOptions {
    port ?: number;
    host ?: string;
    timeout ?: number;
    keepAlive ?: boolean;
    httpAgent ?: http.AgentOptions;
    httpsAgent ?: https.AgentOptions;
    forceSNI ?: boolean;
    httpsPort ?: number;
    sslCaDir ?: string;
}

export type ListenHandler = (err: any) => void;
export type OnErrorHandler = (err: any) => void;
export type OnRequestHandler = () => void;

export type Context = {
    clientToProxyWebSocket: ClientToProxySocket;
}

export type ClientToProxySocket = {
    on(event: ClientToProxyEvent, handler: Function) : void;
    pause(): void;
}

export type ClientToProxyEvent = "message" | "ping" | "error" | "close";
