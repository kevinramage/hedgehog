import * as winston from "winston";
import { Request } from "../request/request";
import { ITestDescriptionHeader } from "./testDescriptionHeader";

export class TestExecutor {

    protected _testDescription : ITestDescriptionHeader | undefined;

    public run (testDescription: ITestDescriptionHeader) {
        winston.debug("TestExecutor.run");
        return new Promise<void>(async resolve => {
            this._testDescription = testDescription;

            this.init();
            await this.execute();

            resolve();
        });
    }

    protected init() {
        throw new Error("not implemented");
    }

    protected execute() : Promise<void> {
        throw new Error("not implemented");
    }

    public writeReport() : string {
        throw new Error("not implemented");
    }

    protected readRequest(req: any) {
        winston.debug("TestExecutor.readRequest");
        const request = Request.instanciateFromUrl(req.url, req.method);
        if (req.headers) {
            Object.keys(req.headers).forEach(key => {
                request.addHeader(key, req.headers[key]);
            });
        }
        if (req.body) {
            request.body = req.body;
        }
        return request;
    }

    public get testDescription() {
        return this._testDescription as ITestDescriptionHeader;
    }
}