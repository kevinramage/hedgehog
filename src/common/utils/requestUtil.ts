import { ClientRequest, IncomingMessage } from "http";
import * as https from "https";
import { Request } from "../business/request/request";
import { Response } from "../business/request/response";
import { Session } from "../../result/session";
import { NumberUtils } from "./numberUtils";
import { PathUtils } from "./pathUtils";
import { Options } from "../business/options";

/**
 * @class
 * Class to send request
 */
export class RequestUtil {

    public static sendRequest(request: Request, redirectLoop: number) {
        return new Promise<Response>((resolve, reject) => {

            // Handlers
            let code = "";
            const onDataReceived = (chunk: any) => { code += chunk; }
            const onErrorReceived = (err: any) => { reject(err); }

            // Create request
            const options : https.RequestOptions = { host: request.host, port: request.port, method: request.method, path: request.path};
            const req = https.request(options, (res) => {

                // Add request to session
                RequestUtil.updateRequestInfos(request, req);
                Session.instance.addRequest(request);

                // Manage events
                res.on("data", onDataReceived);
                res.on("error", onErrorReceived);
                res.on("end", async() => {

                    // Add response to session
                    let response = RequestUtil.convertIncomingMessage(res, code);
                    Session.instance.addResponse(response);

                    // Manage follow redirect
                    if (NumberUtils.equalsOneOf(response.status, [301, 302, 303]) && response.location && redirectLoop < Options.instance.MAX_REDIRECT) {
                        const url = PathUtils.getPathFromUrl(response.location);
                        if (url) {
                            request.path = url;
                            request.cleanHeaders();
                            response = await RequestUtil.sendRequest(request, redirectLoop + 1);
                            resolve(response);
                        } else {
                            resolve(response);
                        }
                    } else {
                        resolve(response);
                    }
                })
            });
            req.on("error", onErrorReceived);

            // Headers
            request.headers.forEach((header) => {
                req.setHeader(header.key, header.value);
            });

            // Body
            if (request.body) {
                req.write(request.body);
            }

            // Send request
            req.end();
        });
    }

    private static convertIncomingMessage(message: IncomingMessage, content: string) {
        const response = new Response(message.statusCode as number, content);
        Object.keys(message.headers).forEach(key => {
            const value = message.headers[key];
            response.addHeader(key, value || "");
        });
        return response;
    }

    private static updateRequestInfos(request: Request, clientRequest: ClientRequest) {
        clientRequest.getHeaderNames().forEach((headerName) => {
            if (!request.getHeader(headerName)) {
                const headerValue = clientRequest.getHeader(headerName) as string | string[];
                request.addHeader(headerName, headerValue);
            }
        });
    }
}