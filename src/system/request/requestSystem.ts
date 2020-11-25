import { Context } from "../../common/business/context";
import { Request, REQUEST_METHODS } from "../../common/business/request";
import { Response } from "../../common/business/response";
import { ISystem } from "../ISystem";
import { Processors } from "../../processor/processors";
import { Analyzers } from "../../analyzer/analyzers";
import { Report } from "../../result/report/report";
import { requestReport } from "../../result/report/requestReport";

export class RequestSystem implements ISystem {

    private _host : string;
    private _port : number;
    private _request : Request | undefined;
    private _report : Report;

    constructor(host: string, port: number) {
        this._host = host;
        this._port = port;
        this._report = new requestReport();
    }

    public async run() {
        const instance = this;
        return new Promise<void>((resolve) => {

            // Write user request
            instance._report.writeRequest(instance);

            // Send request
            this.sendRequest().then(async response => {

                // Define context
                const context = instance.defineContext(response);

                // Execute processors & analyzers
                try {
                    await instance.executeProcessors(context);
                    instance.executeAnalyzers(context);

                } catch (err) {

                }

                // Write report
                instance._report.writeSummary(instance);

                resolve();

            }).catch((err) => {

            });
        });
    }

    private sendRequest() {
        this._report.changeStep("Execute request");
        this._request = new Request(this._host, this._port, REQUEST_METHODS.GET, "/");
        return this._request.send();
    }

    private defineContext(response: Response) {
        return new Context(this._request as Request, response);
    }

    private executeProcessors(context: Context) {
        this._report.changeStep("Execute processors");
        const processors = Processors.instance.getAll();
        const promises = processors.map((processor) => { return processor.process(context); });
        return Promise.all(promises);
    }

    private executeAnalyzers(context: Context) {
        this._report.changeStep("Execute analyzers");
        Analyzers.instance.run(context);
    }



    public get host() {
        return this._host;
    }
    public get port() {
        return this._port;
    }
}