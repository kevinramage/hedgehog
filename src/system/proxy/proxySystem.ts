import { ISystem } from "../ISystem";
import { ProxyManager } from "./proxyManager";
import { Request } from "../../common/business/request";
import { Response } from "../../common/business/response";
import { Context } from "../../common/business/context";
import { Analyzers } from "../../analyzer/analyzers";
import { Report } from "../../result/report/report";
import { ProxyReport } from "../../result/report/proxyReport";
import { Session } from "../../result/session";
import { format } from "util";
import { DataManager } from "../../result/dataManager";

const PROXY_IGNORE_HOSTS = require("../../config/proxyIgnoreHosts.json");

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
        const instance = this;
        return new Promise<void>(async (resolve) => {

            // Write report user request
            instance._report.writeRequest(instance);

            // Instance data manager
            DataManager.instance.init(instance.host);

            // Run proxy manager
            const proxyManager = new ProxyManager(instance.port);
            proxyManager.onResponseReceived(instance.manageRequest.bind(instance));
            await proxyManager.run();
            resolve();
        });
    }

    private manageRequest(request: Request, response: Response) {

        const ignoreHostList = PROXY_IGNORE_HOSTS as string[];

        if ( request.host == this.host ) {

            // Update data manager port if required
            if ( !DataManager.instance.port ) { DataManager.instance.port = request.port; }

            // Get warning count before process
            const warningCount = Session.instance.warningCount;
            
            // Analyze requests
            const context = new Context(request, response);
            Analyzers.instance.run(context);

            // Write a new step to report
            const currentWarningCount = Session.instance.warningCount;
            this._report.changeStep(format("Request %s - New warning: %d", request.path, currentWarningCount - warningCount));
        
        } else if ( !ignoreHostList.includes(request.host)) {
            /// TODO Log ?
        }
    }

    public get host() {
        return this._host;
    }

    public get port() {
        return this._port;
    }
}