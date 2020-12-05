import { NumberUtils } from "../../common/utils/numberUtils";
import { Request, REQUEST_METHODS } from "../../common/business/request/request";
import { Defect } from "../../common/business/session/defect";
import { DataManager } from "../../common/business/session/dataManager";
import { IChecker } from "../IChecker";
import { FuzzingResult } from "./fuzzingResult";
import { Report } from "../../common/business/report/report";
import { FuzzingReport } from "../../common/business/report/fuzzingReport";

import * as winston from "winston";

/**
 * Checker to test the server behaviour from known default server path
 */
export class FuzzingChecker implements IChecker {

    protected _name : string;
    protected _host : string;
    protected _port : number;
    protected _ssl : boolean;
    protected _paths : string[];
    protected _report : Report;
    protected _expectedStatus : number[];
    protected _results : FuzzingResult[];

    /**
     * Constructor
     * @param name fuzzing name
     * @param host host to test
     * @param port port to test
     * @param ssl host use SSL or not
     * @param expectedStatus array of possible response status code for invalid path (e.g 404, 405)
     */
    constructor(name: string, host: string, port: number, ssl: boolean, expectedStatus: number[]) {
        this._name = name;
        this._host = host;
        this._port = port;
        this._ssl = ssl;
        this._paths = [];
        this._report = new FuzzingReport();
        this._expectedStatus = expectedStatus;
        this._results = [];
    }

    /**
     * Run the execution of the checker
     */
    public async run() {
        winston.debug("FuzzingChecker.run");
        return new Promise<void>(async (resolve) => {
            this._report.writeRequest(this);
            const promises = this._paths.map(p => { return this.runRequest(p) });
            this._results = await Promise.all(promises);
            this._report.writeSummary(this);
            resolve();
        });
    }

    /**
     * Run a request for a specific path and analyze result
     * @param path path to test
     */
    public runRequest(path: string) {
        winston.debug("FuzzingChecker.runRequest");
        return new Promise<FuzzingResult>(async (resolve) => {
            try {
                const request = new Request(this._host, this._port, REQUEST_METHODS.GET, path);
                request.followRedirect = false;
                request.ssl = this._ssl;
                const response = await request.send();
                const isExposed = (!NumberUtils.equalsOneOf(response.status as number, this._expectedStatus));
                resolve(new FuzzingResult(path, isExposed, ""));
            } catch (err) {
                resolve(new FuzzingResult(path, false, err.code ? err.code : "NO ERROR CODE"));
            }
        });
    }

    /**
     * Add defect to data manager
     * @param path invalid path
     * @param actual actual status code or error message
     */
    private addDefect(path: string, actual: string) {
        const expected = this._expectedStatus.join(" OR ");
        const defect = new Defect(this.commandLine, path, expected, actual);
        DataManager.instance.addDefect(defect);
    }

    public get name() {
        return this._name;
    }

    public get host() {
        return this._host;
    }

    public get port() {
        return this._port;
    }

    public get results() {
        return this._results;
    }

    public get commandLine() {
        return "";
    }

    public get paths() {
        return this._paths;
    }

    public set paths(value) {
        this._paths = value;
    }
}

export enum FUZZING_NAME {
    COMMON = "COMMON FUZZING",
    PHP = "PHP FUZZING",
    APACHE = "APACHE FUZZING",
    COLD_FUSION = "COLD FUSION FUZZING",
    IIS = "IIS FUZZING",
    JBOSS = "JBOSS FUZZING",
    TOMCAT = "TOMCAT FUZZING"
}