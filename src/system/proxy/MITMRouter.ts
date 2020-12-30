import * as net from "net";
import * as winston from "winston";
import { IncomingMessage, ServerResponse, createServer, Server } from "http";
import * as https from "https";
import { MITMProxy } from "./MITMProxy";
import { fstat, readFileSync, writeFileSync } from "fs";
import { RequestUtil } from "../../common/utils/requestUtil";
import { TLSSocket } from "tls";

//require("../../config/connection/")

export class MIMTRouter {

    private _port : number;
    private _proxy ?: MITMProxy;
    private _httpServer ?: Server;
    private _httpsServer ?: https.Server;

    constructor(port: number) {
        this._port = port;
    }

    public run() {
        console.info("RUUUUNNNN");
        winston.debug("MIMTRouter.run");
        const server = net.createServer({});
        server.on("connection", (socket: net.Socket) => {
            this.onConnection(socket);
        });
        server.on("error", (err) => {
            winston.error("MIMTRouter.run - Internal error", err);
        });
        server.listen(7001, () => {
            console.info("OKKK");
        });
        this.createServers();
    }

    private createServers() {
        this._httpServer = createServer(this.requestListener);
        this._httpsServer = https.createServer({
            cert: readFileSync("resources/server.crt"),
            key: readFileSync("resources/server.key")
        },this.requestListener);
    }

    private async requestListener(req: IncomingMessage, res: ServerResponse) {

        console.info("Request received: " + req.url);
        /*
        
        // Send request
        const request = RequestUtil.generateRequestFromIncomingMessage(req);
        const response = await request.send();
        console.info("Response received: " + response.status);

        // Write response
        res.statusCode = response.status as number;
        response.headers.forEach(h => {
            res.setHeader(h.key, h.value);
        });
        res.write(response.buffer);
        res.end();
        */
        res.statusCode = 200;
        res.write("OK");
        res.end();

        console.info("Response sent: " + res.statusCode);
    }

    private onConnection(socket: net.Socket) {
        winston.debug("MIMTRouter.onConnection");
        socket.once("data", (data: Buffer) => {

            console.info("Received");

            // Pause the socket
            socket.pause();

            // Determine if this is an HTTP(s) request
            let byte = data[0];

            let proxy;
            if (data.toString().startsWith("CONNECT")) {
                //protocol = 'https';
                console.info("HTTPS");
                proxy = this._httpsServer;

            } else {
                //protocol = 'http';
                proxy = this._httpServer;
            }

            if (proxy) {

                // Push the buffer back onto the front of the data stream
                socket.unshift(data);
                // Emit the socket to the HTTP(s) server
                proxy.emit('connection', socket);
            }
            
            // As of NodeJS 10.x the socket must be 
            // resumed asynchronously or the socket
            // connection hangs, potentially crashing
            // the process. Prior to NodeJS 10.x
            // the socket may be resumed synchronously.
            process.nextTick(() => socket.resume()); 

            /*
            // Get content
            const content = data.toString();
            console.info(content);

            // If request starts with CONNECT keyword => Initiate SSL connection
            if (content.startsWith("CONNECT")) {
                socket.write('HTTP/1.1 200 OK\r\n\n');

            // Basic HTTP request
            } else {
                this._proxy = new MITMProxy(socket, content);
                this._proxy.run();
            }*/


        });
        socket.on("error", (err) => {
            winston.error("MIMTRouter.onConnection - Internal error", err);
        });
    }
}