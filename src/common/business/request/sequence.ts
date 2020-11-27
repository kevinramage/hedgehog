import { Request } from "./request";
import { Response } from "./response";

export class Sequence {
    private _items : SequenceItem[];

    constructor() {
        this._items = [];
    }

    public addElement(item: SequenceItem) {
        this._items.push(item);
    }

    public get items() {
        return this._items;
    }
}

export class SequenceItem {
    private _request : Request;
    private _response : Response;

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