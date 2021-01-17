import { Requests } from "../request/requests";
import { PayloadResult } from "./payloadResult";
import { TestExecutor } from "./testExecutor";

export class InjectionTestExecutor extends TestExecutor {
    protected _requests ?: Requests;
    protected _payloadResults : PayloadResult[];

    constructor() {
        super();
        this._payloadResults = [];
    }

    protected get requests() {
        return this._requests as Requests;
    }

    public get payloadResults() {
        return this._payloadResults;
    }
}