import * as net from "net";
import { format } from "util";
import { Request } from "../../common/business/request/request";
import { Response } from "../../common/business/request/response";

export class MITMProxy {

    private _socket : net.Socket;
    private _query : string;

    constructor(socket: net.Socket, query: string) {
        this._socket = socket;
        this._query = query.replace(/\r/g, "");
    }

    public async run() {
        const request = this.readQuery();
        const response = await request.send();
        this.writeResponse(request, response);
    }


    private readQuery() {

        // Read first line
        const lines = this._query.split("\n");
        const data = lines[0].split(" ");
        const method = data[0];
        const requestUrl = new URL(data[1]);
        const path = requestUrl.pathname || "/";
        const port = requestUrl.port ? Number.parseInt(requestUrl.port, 10) : 80;

        // Read headers
        const request = new Request(requestUrl.host, port, method, path);
        for (var i = 1; i < lines.length; i++){
            if (lines[i] !== "") {
                const headerData = lines[i].split(":");
                request.addHeader(headerData[0], headerData[1]);
            }
        }

        return request;
    }

    private writeResponse(request: Request, response: Response) {
        
        // Build response headers
        const headersFiltered = response.headers.filter(h => { return h.key !== "transfer-encoding"; })
        const responseCode = "HTTP/1.1 200 OK";
        const headers = headersFiltered.map(h => { return format("%s: %s", h.key, h.value); });
        const data = [responseCode].concat(headers);
        
        // Write reponse
        this._socket.write((data.join('\n') + '\n\n'));
        this._socket.write(response.buffer as Buffer);
        this._socket.end();
    }
    
}