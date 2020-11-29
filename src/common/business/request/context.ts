import { HtmlPage } from "../control/htmlPage";
import { Request } from "./request";
import { Response } from "./response";

/**
 * Context represent a request and its response
 * Contains the result of processors execution
 */
export class Context {
    private _request : Request;
    private _response : Response;
    private _htmlPage ?: HtmlPage;

    /**
     * Constructor
     * @param request request to analyze
     * @param response response to analyze
     */
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