import Registry = require('winreg');
import * as os from "os";
import { OPTIONS, Options } from '../options';
import { HEADER_NAME } from './header';
import { format } from 'util';
import { Request } from "../request/request";
import * as http from "http";

/**
 * Proxy
 */
export class Proxy {

    private _host: string;
    private _port: number;
    private _userName ?: string;
    private _password ?: string;

    /**
     *
     * @param host proxy host
     * @param port proxy port
     * @param userName proxy user name when authentication required
     * @param password proxy password when authentication required
     */
    constructor(host: string, port: number, userName ?: string, password ?: string) {
        this._host = host;
        this._port = port;
        this._userName = userName;
        this._password = password;
    }

    public get host() {
        return this._host;
    }

    public get port() {
        return this._port;
    }

    public get userName() {
        return this._userName;
    }

    public get password() {
        return this._password;
    }

    /**
     * Update reqiest object with the proxy
     * @param proxy proxy to define or undefined else
     * @param isSSL identify if the request is SSL or not
     * @param options current request options
     */
    public static updateRequestWithProxy(proxy: Proxy | undefined, isSSL: boolean, options: http.RequestOptions) {
        if (proxy) {
            const protocol = isSSL ? "https" : "http";
            const path = format("%s://%s:%d%s", protocol, options.host, options.port, options.path);
            options.host = proxy.host;
            options.port = proxy.port;
            options.path = encodeURI(path);
        }
    }

    /**
     * Get proxy manually defined on system options or automatically from the system
     */
    public static getProxy(request ?: Request) {
        return new Promise<Proxy | undefined>(async (resolve) => {

            // If proxy defined on request
            if (request && request.proxyServer && request.proxyPort) {
                resolve(new Proxy(request.proxyServer, request.proxyPort));

            // If manual proxy defined
            } else if (Options.instance.option(OPTIONS.REQUEST_PROXY_TYPE) === PROXY_TYPE.MANUAL) {
                const proxyHost = Options.instance.option(OPTIONS.REQUEST_PROXY_HOST);
                const proxyPort = Options.instance.option(OPTIONS.REQUEST_PROXY_PORT);
                const proxyUserName = Options.instance.option(OPTIONS.REQUEST_PROXY_USERNAME);
                const proxyPassword = Options.instance.option(OPTIONS.REQUEST_PROXY_PASSWORD);
                if (proxyHost && proxyPort) {
                    resolve(new Proxy(proxyHost, proxyPort, proxyUserName, proxyPassword));
                } else {
                    resolve(undefined);
                }

            // If system proxy used
            } else if (Options.instance.option(OPTIONS.REQUEST_PROXY_TYPE) === PROXY_TYPE.SYSTEM) {
                const proxy = await Proxy.getSystemProxy();
                resolve(proxy);
            }

            return undefined;
        });
    }

    /**
     * Get system proxy (in registry for windows or in environment variables for unix)
     */
    private static getSystemProxy() {
        return new Promise<Proxy | undefined>(async (resolve) => {
            const envProxy = this.getEnvironmentProxy();
            if (!envProxy && os.platform() === "win32") {
                const winProxy = await Proxy.getWindowProxy();
                resolve(winProxy);
            } else {
                resolve(envProxy);
            }
        });
    }

    /**
     * Get proxy defined on environment variarbles
     */
    private static getEnvironmentProxy() {
        if (process.env.https_proxy) {
            return Proxy.parseString(process.env.https_proxy);
        } else if (process.env.http_proxy && process.env.http_proxy.includes(":")) {
            return Proxy.parseString(process.env.http_proxy);
        }
        return undefined;
    }

    /**
     * Get proxy defined on windows registry
     */
    private static getWindowProxy() {
        return new Promise<Proxy | undefined>((resolve) => {
            const keyProxy = "\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings";
            const regKey = new Registry({
                hive: Registry.HKCU,
                key:  keyProxy
            });
            regKey.values((err: Error, items: any[]) => {
                let isResolved = false;
                if (!err) {
                    const proxyEnabled = items.find(i => { return i.name === "ProxyEnable"});
                    const proxyServer = items.find(i => { return i.name === "ProxyEnable"});
                    if (proxyEnabled && proxyEnabled.value && proxyServer && proxyServer.value) {
                        const isProxyEnabled = proxyEnabled.value === "1";
                        const proxy  = Proxy.parseString(proxyServer.value);
                        isResolved = true;
                        resolve(isProxyEnabled ? proxy : undefined);
                    }
                }
                if (!isResolved) {
                    resolve(undefined);
                }
            });
        });
    }

    /**
     * Parse a string with specific format to a proxy instance
     * Format:
     * - host:port
     * - http://host:port
     * - http://user:password@host:port
     * @param proxyString proxy string
     */
    public static parseString(proxyString ?: string) {
        const completeProxyRegex = /https?:\/\/(?<user>.+):(?<password>.+)@(?<host>.+):(?<port>[0-9]+)/g;
        const protocolProxyRegex = /https?:\/\/(?<host>.+):(?<port>[0-9]+)/g;
        const simpleProxy = /(?<host>.+):(?<port>[0-9]+)/g;

        if (proxyString) {

            // Check complete proxy
            let match = completeProxyRegex.exec(proxyString);
            if (!match || !match.groups) {

                // Check protocol proxy
                match = protocolProxyRegex.exec(proxyString);
                if (!match || !match.groups) {

                    // Simple proxy
                    match = simpleProxy.exec(proxyString);
                    if (match && match.groups) {
                        const port = Number.parseInt(match.groups.port, 10);
                        if (!isNaN(port)) {
                            return new Proxy(match.groups.host, port);
                        }
                    }

                // Protocol proxy
                } else {
                    const port = Number.parseInt(match.groups.port, 10);
                    if (!isNaN(port)) {
                        return new Proxy(match.groups.host, port);
                    }
                }

            // Complete proxy
            } else {
                const port = Number.parseInt(match.groups.port, 10);
                if (!isNaN(port)) {
                    return new Proxy(match.groups.host, port, match.groups.user, match.groups.password);
                }
            }
        }
        return undefined;
    }

    /**
     * Add proxy authorization header from proxy instance
     * @param request request to update
     * @param proxy proxy instance to use
     */
    public static addProxyAuthorization(request: Request | http.ClientRequest, proxy: Proxy | undefined) {
        if (request instanceof http.ClientRequest) {
            this.addProxyAuthorizationToInternalRequest(request, proxy);
        } else {
            this.addProxyAuthorizationToBusinessRequest(request, proxy);
        }
    }

    private static addProxyAuthorizationToInternalRequest(request: http.ClientRequest, proxy: Proxy | undefined) {
        if (proxy && proxy.userName && proxy.userName !== "" && proxy.password && proxy.password !== "") {
            const authorizationValue = 'Basic ' + Buffer.from(format("%s:%s", proxy.userName, proxy.password)).toString('base64');
            request.setHeader(HEADER_NAME.PROXYAUTHORIZATION, authorizationValue);
        }
    }

    public static addProxyAuthorizationToBusinessRequest(request: Request, proxy: Proxy | undefined) {
        if (request.proxyUsername && request.proxyPassword) {
            const authorizationValue = 'Basic ' + Buffer.from(format("%s:%s", request.proxyUsername, request.proxyPassword)).toString('base64');
            request.addHeader(HEADER_NAME.PROXYAUTHORIZATION, authorizationValue);
        }
        else if (proxy && proxy.userName && proxy.userName !== "" && proxy.password && proxy.password !== "") {
            const authorizationValue = 'Basic ' + Buffer.from(format("%s:%s", proxy.userName, proxy.password)).toString('base64');
            request.addHeader(HEADER_NAME.PROXYAUTHORIZATION, authorizationValue);
        }
    }
}

/**
 * Proxy type
 */
export enum PROXY_TYPE {
    MANUAL = "MANUAL",
    SYSTEM = "SYSTEM"
}