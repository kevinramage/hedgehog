import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import * as YAML from "yaml";
import { IErrorCode, IErrorsCode } from "./IErrorsCode";
import { Socket } from "net";

export class ServerVersionIdentifier {
    
    private _host : string;
    private _port : number;
    private _ssl : boolean;
    private _errors : IErrorCode[];

    constructor(host: string, port: number, ssl : boolean = false) {
        this._host = host;
        this._port = port;
        this._ssl = ssl;
        this._errors = [];
        this.init();
    }

    init() {
        const errorsCode = fs.readFileSync("src/server/version/errorsCode.yml");
        const errors = YAML.parse(errorsCode.toString()) as IErrorsCode;
        this._errors = errors.errors;
    }

    identify() {
        return new Promise<Result>((resolve, reject) => {
            this.runQuery().then(res => {
                resolve(this.analyzeResponse(res));
            }).catch((err) => {
                const result = new Result();
                result.host = this._host;
                result.port = this._port;
                result.error = err;
                resolve(result);
            })
        });
    }

    runQuery() {
        return new Promise<string>((resolve, reject) => {
            let code = "", req;

            // Handlers
            const onReceivedData = (chunk: any) => { code += chunk };
            const onEnd = () => { resolve(code); };
            const onError = (err: Error) => { reject(err); }

            // Request options
            const options : http.RequestOptions = {
                hostname: this._host,
                port: this._port,
                method: "GET",
                path: "/errorPath"
            }
            
            // Create HTTPS request
            if ( this._ssl ) {
                req = https.request(options, (res) => {
                    res.on("data", onReceivedData);
                    res.on("end", onEnd);
                    res.on("error", onError);
                });

            // Create HTTP request
            } else {
                req = http.request(options, (res) => {
                    res.on("data", onReceivedData);
                    res.on("end", onEnd);
                    res.on("error", onError);
                });
            }

            req.on("error", (err) => {
                reject(err);
            });
            req.end();
        });
    }

    analyzeResponse(responseContent: string) : Result{
        const tests = this._errors.map(e => {
            const content = responseContent.replace(/\r/g, "").replace(/\n/g, "");
            const match = new RegExp(e.regex, "i").exec(content);
            return {
                serverType: e.name,
                serverVersion: e.version,
                sourceCodeMatches: match !== null
            } as ITest
        });
        const serverIdentified = tests.find(t => { return t.sourceCodeMatches });

        const result = new Result();
        result.host = this._host;
        result.port = this._port;
        result.ssl = this._ssl;
        result.serverType = serverIdentified ? serverIdentified.serverType : "";
        result.tests = tests;

        return result;
    }
}

export class Result {
    public host: string;
    public port: number;
    public ssl: boolean;
    public error: string;
    public serverType: string;
    public tests: ITest[];

    constructor() {
        this.host = "";
        this.port = -1;
        this.ssl = false;
        this.error = "";
        this.serverType = "";
        this.tests = [];
    }

    toString() {
        let content;

        if ( this.error ) {
            content = { host: this.host, port: this.port, ssl: this.ssl, error: this.error };
        } else {
            content = { host: this.host, port: this.port, ssl: this.ssl, serverType: this.serverType, tests: this.tests };
        }

        return JSON.stringify(content);
    }
}

export interface ITest {
    serverType: string;
    serverVersion: string;
    sourceCodeMatches: boolean;
}