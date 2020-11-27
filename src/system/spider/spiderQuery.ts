import { PathUtils } from "../../common/utils/pathUtils";
import { Request, REQUEST_METHODS } from "../../common/business/request";
import { HtmlUtils } from "../../common/utils/htmlUtils";
import { SiteTreeView } from "./siteTreeView";
import { Analyzers } from "../../analyzer/analyzers";
import { Context } from "../../common/business/context";
import * as winston from "winston";

export class SpiderQuery {
    private _host : string;
    private _port : number;
    private _path: string;
    private _subQueries : SpiderQuery[];
    private _knownUrls: string[];
    private _siteTreeView ?: SiteTreeView;
    private _errorMessage : string;

    constructor(host: string, port: number, path: string) {
        this._host = host;
        this._port = port;
        this._path = path;
        this._subQueries = [];
        this._knownUrls = [];
        this._errorMessage = "";
    }

    public run() {
        return this.extractLinks();
    }

    private extractLinks() {
        return new Promise<void>((resolve) => {

            // Run query
            const request = new Request(this._host, this._port, REQUEST_METHODS.GET, this._path);
            request.send().then((response) => {

                // Analyzers
                const context = new Context(request, response);
                Analyzers.instance.run(context);

                // Extract links
                if (response.body && response.isHtmlResponse) {
                    const links = HtmlUtils.extractLinks(response.inlineBody);
                    links.forEach(link => {
                        if (link.href) {
                            this.addSpiderQuery(link.href);
                        }
                    });
                }
                resolve();
            }).catch((err) => {
                this._errorMessage = err;
                resolve();
            });
        });
    }

    private addSpiderQuery(path: string) {
        if (path.startsWith("http")) {
            return this._addSpiderQuery(PathUtils.getPathFromUrl(path) as string);
        } else {
            return this._addSpiderQuery(path);
        }
    }

    private _addSpiderQuery(path: string) {
        if (PathUtils.isInDomain(path, this._host)) {
            if (!this.isPathAlreadyProceeded(path) && PathUtils.isNavigablePath(path)) {
                const spiderQuery = new SpiderQuery(this._host, this._port, path);
                spiderQuery.siteTreeView = this.siteTreeView;
                this._subQueries.push(spiderQuery);
                this._knownUrls.push(path);
                this.siteTreeView?.includePath(path);
            }
        } else if (path.includes(this._host)) {
            winston.warn("addSpiderQuery - OUT OF DOMAIN: " + path + " VS " + this._host);
        }
    }

    private isPathAlreadyProceeded(path: string) {
        return this._knownUrls.includes(path);
    }

    public get path() {
        return this._path;
    }

    public get subQueries() {
        return this._subQueries;
    }

    public get knownUrls() {
        return this._knownUrls;
    }

    public set knownUrls(value) {
        this._knownUrls = value;
    }

    public get siteTreeView() {
        return this._siteTreeView;
    }
    public set siteTreeView(value) {
        this._siteTreeView = value;
    }
}