import { NumberUtils } from "../../common/utils/numberUtils";
import { format } from "util";
import { Request, REQUEST_METHODS } from "../../common/business/request";
import { Defect } from "../../result/defect";
import { DataManager } from "../../result/dataManager";
import { IChecker } from "../IChecker";

/**
 * Checker to test the server behaviour from known default server path
 */
export class Fuzzing implements IChecker {

    protected _host : string;
    protected _port : number;
    protected _paths : string[];
    protected _expectedStatus : number[];

    /**
     * Constructor
     * @param host host to test
     * @param port port to test
     * @param expectedStatus array of possible response status code for invalid path (e.g 404, 405)
     */
    constructor(host: string, port: number, expectedStatus: number[]) {
        this._host = host;
        this._port = port;
        this._paths = [];
        this._expectedStatus = expectedStatus;
    }

    /**
     * Run the execution of the checker
     */
    public async run() {
        const instance = this;
        const promises = instance._paths.map(p => { return instance.runRequest(p); })
        await Promise.all(promises);
    }

    /**
     * Run a request for a specific path and analyze result
     * @param path path to test
     */
    public runRequest(path: string) {
        const instance = this;
        return new Promise<void>(async (resolve) => {
            try {
                const request = new Request(instance._host, instance._port, REQUEST_METHODS.GET, path);
                const response = await request.send();
                if ( !NumberUtils.equalsOneOf(response.status as number, instance._expectedStatus)) {
                    console.info(format("Path: %s, Code: %d => not expected", path, response.status));
                    instance.addDefect(path, response.status + "");
                }
            } catch (err) {
                console.info("Path: %s, Error: %s => not expected", path, err.code);
                instance.addDefect(path, err.code ? err.code : err);
            }
            resolve();
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

    public get host() {
        return this._host;
    }

    public get port() {
        return this._port;
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