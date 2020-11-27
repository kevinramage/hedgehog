import { HtmlPage } from "../control/htmlPage";
import { Request } from "./request";
import { Response } from "./response";

export class Context {
    private _request : Request;
    private _response : Response;
    private _htmlPage ?: HtmlPage;

    constructor(request: Request, response: Response) {
        this._request = request;
        this._response = response;
    }

    public get request() {
        return this._request;
    }

    public get response() {
        return this._response;
    }

    public get htmlPage() {
        return this._htmlPage;
    }
    public set htmlPage(value) {
        this._htmlPage = value;
    }
}