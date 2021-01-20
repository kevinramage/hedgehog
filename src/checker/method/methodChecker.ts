import { IChecker } from "../IChecker";
import { Report } from "../../common/business/report/report";
import { MethodReport } from "../../common/business/report/methodReport";
import { MethodResult } from "../../common/business/checker/methodResult";
import { MethodListener } from "../../common/business/checker/methodListener";

/**
 * Checker to test http method allow by the server
 */
export class MethodChecker implements IChecker {

    private _host : string;
    private _port : number;
    private _ssl : boolean;
    private _path : string;
    private _methodsToCheck: string[];
    private _results : MethodResult[];
    private _report : Report;

    /**
     * Constructor
     * @param host host to check
     * @param port port to check
     * @param path path to check
     */
    constructor(host: string, port: number, ssl: boolean, path: string) {
        this._host = host;
        this._port = port;
        this._ssl = ssl;
        this._path = path;
        this._methodsToCheck = [];
        this._results = [];
        this._report = new MethodReport();
    }

    /**
     * Run the execution of the checker
     */
    public run(): Promise<void> {
        return new Promise<void>(async (resolve) => {

            const methodListener = new MethodListener(this.host, this.port, this.path, this.ssl, new MethodReport());
            await methodListener.run();

            this._results = methodListener.results;

            resolve();
        });
    }

    public get host() {
        return this._host;
    }

    public get port() {
        return this._port;
    }

    public get ssl() {
        return this._ssl;
    }

    public get path() {
        return this._path;
    }

    public get results() {
        return this._results;
    }

    public get methodsToCheck() {
        return this._methodsToCheck;
    }

    public static fromArgs(content: string) {
        return null;
    }
}