import { ResponseReceivedHandler } from "./proxyManager2";
import { Request } from "../../common/business/request/request";
import { Response } from "../../common/business/request/response";
import * as fs from "fs";

var http = require('http'),
    httpProxy = require('http-proxy');

export class ProxyManager {
    private _port : number;
    private _handlers : ResponseReceivedHandler[];

    constructor(port: number) {
        this._port = port;
        this._handlers = [];
    }

    public run() {
        return new Promise<void>((resolve) => {
            var proxy = httpProxy.createProxyServer({
                /*
                ssl: {
                    key: fs.readFileSync('resources/server.key'),
                    cert: fs.readFileSync('resources/server.crt')
                  },
                  */
                  //target: 'https://hack.me/'
                  //csecure: true
            });
            proxy.on("error", (err: Error) => {
                console.error(err);
            });
            proxy.on("open", () => {
                console.info("open");
            });
            proxy.on("proxyReq", () => {
                console.info("porxy request");
            });
            console.info("coucou");
            proxy.listen(7001);
        });
    }

    public onResponseReceived(responseReceivedHander: ResponseReceivedHandler) {
        this._handlers.push(responseReceivedHander);
    }

    private notify(request: Request, response: Response) {
        this._handlers.forEach((h) => {
            h(request, response);
        });
    }
}