import { Request } from "../business/request/request";
import { Response } from "../business/request/response";
import { Session } from "../../common/business/session/session";
import { NumberUtils } from "./numberUtils";
import { PathUtils } from "./pathUtils";
import { OPTIONS, Options } from "../business/options";
import { TLSSocket } from "tls";
import { ICertificate } from "../business/request/certificate";

import * as http from "http";
import * as https from "https";
import { Proxy } from "../business/request/proxy";
import { HedgeHogInfo } from "../business/hedgehogInfo";



/**
 * @class
 * Class to send request
 */
export class RequestUtil {

    public static sendRequest(request: Request, redirectLoop: number) {
        return new Promise<Response>(async (resolve, reject) => {

            // Handlers
            let code = "";
            const onDataReceived = (chunk: any) => { code += chunk; }
            const onErrorReceived = (err: any) => { reject(err); }

            // Define options
            const options = { host: request.host, port: request.port, method: request.method, path: encodeURI(request.path) };

            // Update options when proxy defined
            const proxy = await Proxy.getProxy();
            Proxy.updateRequestWithProxy(proxy, request.ssl, options);

            // Define response handler
            let req : http.ClientRequest;
            const responseHandler = (res : http.IncomingMessage) => {

                // Add request to session
                RequestUtil.updateRequestInfos(request, req);
                Session.instance.addRequest(request);

                // Manage events
                res.on("data", onDataReceived);
                res.on("error", onErrorReceived);
                res.on("end", async() => {

                    // Add response to session
                    let response = RequestUtil.convertIncomingMessage(res, code);
                    response.endDateTime = new Date();
                    response.executionTime = response.endDateTime.getTime() - request.startDateTime.getTime();
                    Session.instance.addResponse(response);

                    // Manage follow redirect
                    const maxRedirection = Options.instance.option(OPTIONS.REQUEST_MAXREDIRECT);
                    if (NumberUtils.equalsOneOf(response.status, [301, 302, 303]) && response.location &&
                        request.followRedirect && redirectLoop < maxRedirection) {
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
            };

            // Create request
            req = request.ssl ? https.request(options, responseHandler) : http.request(options, responseHandler);

            // Headers
            request.headers.forEach((header) => {
                req.setHeader(header.key, header.value);
            });

            // Add proxy authorization if required
            Proxy.addProxyAuthorization(req, proxy);

            // Add additional headers
            RequestUtil.addAdditionalHeaders(req);

            // Body
            if (request.body) {
                req.write(request.body);
            }

            // Error handling
            req.on("error", onErrorReceived);

            // Send request
            req.end();
        });
    }

    private static convertIncomingMessage(message: http.IncomingMessage, content: string) {
        const response = new Response(message.statusCode as number, content);
        const socket = (message.socket as TLSSocket);
        if (socket && socket.getCertificate) {
            response.certificate = (socket?.getPeerCertificate(true) as ICertificate);
        }
        Object.keys(message.headers).forEach(key => {
            const value = message.headers[key];
            response.addHeader(key, value || "");
        });
        return response;
    }

    private static updateRequestInfos(request: Request, clientRequest: http.ClientRequest) {
        clientRequest.getHeaderNames().forEach((headerName) => {
            if (!request.getHeader(headerName)) {
                const headerValue = clientRequest.getHeader(headerName) as string | string[];
                request.addHeader(headerName, headerValue);
            }
        });
    }

    public static addAdditionalHeaders(request: http.ClientRequest) {
        RequestUtil.addCustomHeader(request);
        RequestUtil.addHedgeHogHeader(request);
    }

    private static addCustomHeader(request: http.ClientRequest) {
        if (Options.instance.option(OPTIONS.REQUEST_CUSTOMHEADER_ENABLED) === true) {
            const key = Options.instance.option(OPTIONS.REQUEST_CUSTOMHEADER_KEY);
            const value = Options.instance.option(OPTIONS.REQUEST_CUSTOMHEADER_VALUE);
            request.setHeader(key, value);
        }
    }

    private static addHedgeHogHeader(request: http.ClientRequest) {
        if (Options.instance.option(OPTIONS.REQUEST_HEDGEHOG_ENABLED) === true) {
            request.setHeader("HedgeHog-Version", HedgeHogInfo.version);
        }
    }
}