import { ISystem } from "../ISystem";
import { ProxyManager } from "./proxyManager4";
import { Request } from "../../common/business/request/request";
import { Response } from "../../common/business/request/response";
import { Context } from "../../common/business/request/context";
import { Analyzers } from "../../analyzer/analyzers";
import { Report } from "../../common/business/report/report";
import { ProxyReport } from "../../common/business/report/proxyReport";
import { Session } from "../../common/business/session/session";
import { format } from "util";
import { DataManager } from "../../common/business/session/dataManager";

import * as winston from "winston";

import PROXY_IGNORE_HOSTS = require("../../config/proxyIgnoreHosts.json");

export class ProxySystem implements ISystem {

    private _host : string;
    private _port : number;
    private _report : Report;

    constructor(host: string, port: number) {
        this._host = host;
        this._port = port;
        this._report = new ProxyReport();
    }

    public run() {
        return new Promise<void>(async (resolve) => {

            // Write report user request
            this._report.writeRequest(this);

            // Instance data manager
            DataManager.instance.init(this.host);

            // Run proxy manager
            const proxyManager = new ProxyManager(this.port);
            proxyManager.onResponseReceived(this.manageRequest.bind(this));
            await proxyManager.run();
            resolve();
        });
    }

    private manageRequest(request: Request, response: Response) {

        const ignoreHostList = PROXY_IGNORE_HOSTS as string[];

        if (request.host === this.host) {

            // Update data manager port if required
            if (!DataManager.instance.port) { DataManager.instance.port = request.port; }

            // Get warning count before process
            const warningCount = Session.instance.warningCount;

            // Analyze requests
            const context = new Context(request, response);
            Analyzers.instance.run(context);

            // Write a new step to report
            const currentWarningCount = Session.instance.warningCount;
            this._report.changeStep(format("Request %s - New warning: %d", request.path, currentWarningCount - warningCount));

        } else if (!ignoreHostList.includes(request.host)) {
            winston.warn("Host ignore but seems matches: " + request.host);
        }
    }

    public get host() {
        return this._host;
    }

    public get port() {
        return this._port;
    }
}