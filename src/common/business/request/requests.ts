import { HEADER_NAME } from "./header";
import { Request } from "./request";
import { Response } from "./response";

export class Requests {
    private _requests : Request[];
    private _cookie ?: string;

    constructor() {
        this._requests = [];
    }

    public send(variables: {[key: string]: string}) {
        return new Promise<Response>(async (resolve) => {
            let currentResponse = null;
            for ( var i = 0; i < this._requests.length; i++) {
                this.injectCookie(this._requests[i]);
                this._requests[i].evaluate(variables);
                currentResponse = await this._requests[i].send();
                this.updateVariables(variables, this._requests[i], currentResponse);
                this.updateCookies(currentResponse);
            }
            if (currentResponse == null) {
                throw new Error("No requests to execute")
            }
            resolve(currentResponse as Response);
        });
    }

    public updateVariables(variables: {[key: string]: string}, request: Request, response: Response) {
        request.extracts.forEach(extract => {
            const value = extract.evaluate(response.body as string);
            variables[extract.name] = value ? value : "null";
        });
    }

    public injectCookie(request: Request) {
        if (this._cookie) {
            request.addHeader("cookie", this._cookie)
        }
    }

    public updateCookies(response: Response) {
        const setCookie = response.getHeaderValue(HEADER_NAME.SETCOOKIE);
        if (setCookie) {
            this._cookie = setCookie as string;
        }
    }

    public clone() {
        const newRequests = new Requests();
        newRequests._requests = this._requests.map(r => { return r.clone(); })
        return newRequests;
    }

    public addRequest(request: Request) {
        this._requests.push(request);
    }
}