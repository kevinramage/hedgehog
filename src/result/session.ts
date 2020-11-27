import { v4 } from "uuid";
import { format } from "util";
import { join } from "path";
import { mkdirSync, existsSync, closeSync, openSync, appendFileSync } from "fs";
import { Request } from "../common/business/request/request";
import { Response } from "../common/business/request/response";
import { Warning } from "./warning";
import { SiteTreeView } from "../system/spider/siteTreeView";

export class Session {
    private static SEPARATOR = "------------------------------------------------------------------------------";
    private static _instance : Session;
    private _id : string;
    private _requests: Request[];
    private _responses : Response[];
    private _warnings: Warning[];
    private _siteTreeView ?: SiteTreeView;

    private constructor() {
        this._id = v4();
        this._requests = [];
        this._responses = [];
        this._warnings = [];
        this.init();
    }

    private init() {
        if (!existsSync("sessions")) {
            mkdirSync("sessions");
        }
        this.createSession();
    }

    private createSession() {
        mkdirSync(this.sessionPath);
        closeSync(openSync(this.warningsPath, "w"));
        closeSync(openSync(this.requestsPath, "w"));
        closeSync(openSync(this.treeViewPath, "w"));
    }

    /**
     * Add request to session and write the request in log file
     * @param request request
     * ///TODO Improve the system with using kind of string builder based on Array.join or Buffer with adaptive length
     */
    public addRequest(request: Request) {
        this._requests.push(request);
        this.writeRequest(request);
    }

    private writeRequest(request: Request) {
        let content = format("%s %s HTTP/1.1\n", request.method, request.path);
        request.headers.forEach(header => {
            content += format("%s: %s\n", header.key, header.value);
        });
        content += "\n...\n"; // BODY
        appendFileSync(this.requestsPath, content);
    }

    public addResponse(response: Response) {
        this._responses.push(response);
        this.showResponse(response);
    }

    private showResponse(response: Response) {
        let content = format(">>> Response\ncode: %d\n", response.status);
        response.headers.forEach(header => {
            content += format("%s: %s\n", header.key, header.value);
        });
        content += "\n...\n"; // BODY
        content += format("%s\n", Session.SEPARATOR);
        appendFileSync(this.requestsPath, content);
    }

    public addWarning(warning: Warning) {
        this._warnings.push(warning);
        let content = "";
        if (warning.request) {
            content += format("%s %s\n", warning.request.method, warning.request.path);
        }
        content += format("Severity: %s\n", warning.severity);
        content += format("Type: %s\n", warning.type);
        content += format("Name: %s\n", warning.name);
        if (warning.details !== "") {
            content += format("Details: %s\n", warning.details);
        }
        content += format("%s\n", Session.SEPARATOR);
        appendFileSync(this.warningsPath, content);
    }

    public assignSiteTreeView(siteTreeView: SiteTreeView) {
        this._siteTreeView = siteTreeView;
        appendFileSync(this.treeViewPath, siteTreeView.toTree());
    }

    private get sessionPath() {
        return join("sessions", this._id);
    }

    private get warningsPath() {
        return join("sessions", this._id, "warnings.log");
    }

    private get requestsPath() {
        return join("sessions", this._id, "requests.log");
    }

    private get treeViewPath() {
        return join("sessions", this._id, "treeView.log");
    }

    public get id() {
        return this._id;
    }

    public get warningCount() {
        return this._warnings.length;
    }

    public static get instance() {
        if (!Session._instance) {
            Session._instance = new Session();
        }
        return Session._instance;
    }
}