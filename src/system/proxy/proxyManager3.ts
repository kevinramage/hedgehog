import { ResponseReceivedHandler } from "./proxyManager2";
import { Request } from "../../common/business/request/request";
import { Response } from "../../common/business/request/response";

import * as https from "https";
import * as net from "net";
import * as http from "http";
import { readFileSync } from "fs";

export class ProxyManager {
    private _port : number;
    private _handlers : ResponseReceivedHandler[];

    constructor(port: number) {
        this._port = port;
        this._handlers = [];
    }

    public run() {
        return new Promise<void>((resolve) => {
            console.info("ProxyManager3");
            /*
            const server = https.createServer({
                cert: readFileSync("resources/server.crt"),
                key: readFileSync("resources/server.key")
            }, this.requestListener);
            */

          const mitm_server = https.createServer({
            cert: readFileSync("resources/server.crt"),
            key: readFileSync("resources/server.key")
        }, this.requestListener);
        
          mitm_server.listen(8081);

           const server = http.createServer(this.requestListener);

            // Handle connect request (for https)
            server.addListener('upgrade', function(req, socket, upgradeHead) {
                console.info("upgrade");
                var proxy = net.createConnection(7001, 'localhost');

                proxy.on('connect', function() {
                    socket.write( "HTTP/1.0 200 Connection established\r\nProxy-agent: Netscape-Proxy/1.1\r\n\r\n"); 
                });

                // connect pipes
                proxy.on( 'data', function(d) { socket.write(d)   });
                socket.on('data', function(d: any) { try { proxy.write(d) } catch(err) {}});

                proxy.on( 'end',  function()  { socket.end()      });
                socket.on('end',  function()  { proxy.end()       });

                proxy.on( 'close',function()  { socket.end()      });
                socket.on('close',function()  { proxy.end()       });

                proxy.on( 'error',function()  { socket.end()      });
                socket.on('error',function()  { proxy.end()       });
            });

            server.listen(7001);
        });
    }

    private requestListener(req: http.IncomingMessage, res: http.ServerResponse) {
        console.info(req.url);
        /*
        const requestOptions : https.RequestOptions = {
            hostname:
        };
        https.request(requestOptions)
        */
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