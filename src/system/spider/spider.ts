import { Session } from "../../common/business/session/session";
import { Report } from "../../common/business/report/report";
import { ISystem } from "../ISystem";
import { SiteTreeView } from "./siteTreeView";
import { SpiderQuery } from "./spiderQuery";
import { SpiderReport } from "../../common/business/report/spiderReport";

export class Spider implements ISystem {
    private _host : string;
    private _port : number;
    private _maxDepth : number;
    private _report : Report;

    constructor(host: string, port: number, depth: number) {
        this._host = host;
        this._port = port;
        this._maxDepth = depth;
        this._report = new SpiderReport();
    }

    public run() {
        return new Promise<void>(async (resolve) => {

            // Write user request
            this._report.writeRequest(this);

            // Run spider
            const spiderQuery = new SpiderQuery(this.host, this._port, "/");
            spiderQuery.siteTreeView = new SiteTreeView();
            await spiderQuery.run();

            // Run sub queries
            spiderQuery.subQueries.forEach((query) => { query.knownUrls = spiderQuery.knownUrls; });
            await this.runDepth(spiderQuery.subQueries, 1);

            // Tree
            Session.instance.assignSiteTreeView(spiderQuery.siteTreeView);

            // Write summary
            this._report.writeSummary(this);

            resolve();
        });
    }

    private runDepth(spiderQueries: SpiderQuery[], depth: number) {
        this._report.changeStep("Navigate to a depth of " + depth);
        return new Promise<void>((resolve) => {

            // Check depth
            if (depth < this.maxDepth) {

                // Run queries
                const promises = spiderQueries.map((spiderQuery) => {
                    return spiderQuery.run();
                });
                Promise.all(promises).then(async () => {

                    //  Prepare next run
                    const subQueries = spiderQueries.map((query) => { return query.subQueries })
                        .reduce((a, b) => { return a.concat(b); });
                    const knownUrls =  spiderQueries.map((query) => { return query.knownUrls; })
                        .reduce((a, b) => { return a.concat(b); });

                    // Recursive call
                    subQueries.forEach((query) => { query.knownUrls = knownUrls; });
                    await this.runDepth(subQueries, depth + 1);
                    resolve();

                }).catch(() => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    public get host() {
        return this._host;
    }
    public get port() {
        return this._port;
    }
    public get maxDepth() {
        return this._maxDepth;
    }
}