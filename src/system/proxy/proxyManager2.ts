import { Request } from "../../common/business/request/request";
import { Response } from "../../common/business/request/response";

import * as net from "net";
import stream from "stream";
import { MIMTRouter } from "./MITMRouter";


/**
 * https://medium.com/@nimit95/a-simple-http-https-proxy-in-node-js-4eb0444f38fc
 */
export class ProxyManager {
    private _port : number;
    private _handlers : ResponseReceivedHandler[];

    constructor(port: number) {
        this._port = port;
        this._handlers = [];
    }

    public run() {
        return new Promise<void>((resolve) => {
            const router = new MIMTRouter(this._port);
            router.run();
            // this.createServer();
            // resolve();
        });
    }

    private createDuplex(context: ProxyContext) {
        context.interceptor = new stream.Duplex({
            read: this.read,
            write: (chunk, encoding, next) => { this.write(chunk, encoding, next, context); },
            emitClose: true,
            autoDestroy: true,
            writev: (chunks: any) => { console.info("WRITE END"); }
        });
        context.interceptor.on("close", () => {
            console.info("close");
        });
        context.interceptor.on("data", (chunk) => {
            console.info("data");
        });
        context.interceptor.on("end", () => {
            console.info("end");
        });
    }

    private read(this: stream.Duplex, size: number) {
        // console.info("read");
        // console.info(size);
    }

    private write(chunk: any, encoding: BufferEncoding, next: Function, context: ProxyContext) {
        const content = this.readBufferChunk(chunk + "");
        // console.info(context.requestMethod + " - " + context.requestUrl);
        // console.info((chunk + "").split("\n")[0]);
        console.info("WRITE");
        // console.info(encoding);
        next();
    }

    private end(cb: Function, context: ProxyContext) {
        // console.info(context.requestMethod + " - " + context.requestUrl);
        // console.info("END");
    }

    private readBufferChunk(chunk: string) {
        let headerContent = "", dataContent = "";
        
        chunk = chunk.replace(/\r/g, "");
        const lines = chunk.split("\n");
        let i = 0;
        for ( i = 0; i < lines.length && lines[i].trim() !== ""; i++) {
            headerContent += lines[i] + "\n";
        }
        for ( var j = i+1; j < lines.length; j++) {
            //dataContent += lines[i] + "\n";
        }
        //console.info("Start ....");
        //console.info(headerContent);
        //console.info("End ....");
        return {
            header: headerContent,
            data: dataContent
        };
    }

    private createServer() {
        const server = net.createServer();
        server.on("connection", this.onConnect.bind(this));
        server.on("error", (err) => {
            console.error("Error on server ...");
            console.error(err);
        });
        server.listen(7001, () => {
            console.info("Listening ...");
        });
    }

    private onConnect(socket: net.Socket) {
        socket.on("data", (data) => {

            // Get connexion content
            const content = data.toString();
            const firstLine = content.split("\n")[0];

            // Create context
            console.info("New context");
            const context = new ProxyContext();
            context.clientToProxy = socket;
            context.isSSL = content.startsWith("CONNECT ");
            context.requestMethod = firstLine.split(" ")[0];
            context.requestUrl = firstLine.split(" ")[1];
            context.requestProtocol = firstLine.split(" ")[2];
            this.createDuplex(context);
            this.parseHost(context, content);

            // Send socket
            if (context.host !== "") {
                this.sendSocket(context, data);
            }
        });
        socket.on("error", (err) => {
            console.error("Error during the request between the client and the proxy");
            console.error(err);
        });
    }

    private sendSocket(context: ProxyContext, data: Buffer) {
        context.proxyToServer = net.createConnection({
            host: context.host,
            port: context.port
        }, () => {
            // console.info("Create connexion to server ...");

            if ( context.isSSL ) {
                context.clientToProxy?.write('HTTP/1.1 200 OK\r\n\n');
            } else {
                context.proxyToServer?.write(data);
            }

            context.clientToProxy?.pipe(context.proxyToServer as net.Socket);
            context.proxyToServer?.pipe(context.interceptor as stream.Duplex);
            context.proxyToServer?.pipe(context.clientToProxy as net.Socket);
        });
        context.proxyToServer.on("close", () => {
            console.info("DDDDDDDOOOOOOOOOOONNNNNNNNNNNNNEEEEEEEEE");
        });
        context.proxyToServer.on("error", (err) => {
            console.error("Error during the request between the proxy and the server");
            console.error(err);
        });
    }

    private parseHost(context: ProxyContext, content: string) {
        // console.info("IsSSL: " + context.isSSL);
        if (context.isSSL) {
            const regex = /CONNECT (?<host>.*) HTTP\/1/g;
            const match = regex.exec(content);
            if (match && match.groups) {
                const host = this.parseHostArg(match.groups.host, true);
                context.host = host.host;
                context.port = host.port;
            }  
        } else {
            const regex = /Host: (?<host>.*)\r?\n/g;
            const match = regex.exec(content);
            if (match && match.groups) {
                const host = this.parseHostArg(match.groups.host, false);
                context.host = host.host;
                context.port = host.port;
            }
        }
    }

    private parseHostArg(hostArg: string, isSSL: boolean) {
        const data = hostArg.split(":");
        if ( data.length === 2) {
            return {
                host: data[0],
                port: Number.parseInt(data[1], 10)
            }
        } else {
            return {
                host: data[0],
                port: isSSL ? 443 : 80
            }
        }
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

export type ResponseReceivedHandler = (request: Request, response: Response) => void;

export class ProxyContext {
    public host : string;
    public port : number;
    public isSSL : boolean;
    public interceptor ?: stream.Duplex;
    public clientToProxy ?: net.Socket;
    public proxyToServer ?: net.Socket;
    public requestMethod : string;
    public requestUrl : string;
    public requestProtocol : string;

    constructor() {
        this.host = "";
        this.port = -1;
        this.isSSL = false;
        this.requestMethod = "";
        this.requestUrl = "";
        this.requestProtocol = "";
    }
}