import { Request } from "./request";
import { Response } from "./response";

/**
 * Represent a request and response
 */
export class SequenceItem {
    private _request : Request;
    private _response : Response;

    /**
     * Constructor
     * @param request request
     * @param response response
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
}