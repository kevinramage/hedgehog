import { IChecker } from "../IChecker";
import { SSLMethodResult } from "../../common/business/checker/sslMethodResult";
import * as winston from "winston";
import { SSLReport } from "../../common/business/report/sslReport";
import { SSLMethodListener } from "../../common/business/checker/sslMethodListener";

/**
 * Checker to test the SSL method allowed by the server
 */
export class SSLMethodChecker implements IChecker {

    public static NAME = "SSLProcolChecker";
    private _host : string;
    private _port : number;
    private _results : SSLMethodResult[];

    /**
     * Constructor
     * @param host host to test
     * @param port port to test
     */
    constructor(host: string, port: number) {
        this._host = host;
        this._port = port;
        this._results = [];
    }

    public run(): Promise<void> {
        winston.debug("SSLMethodChecker.run");
        return new Promise<void>(async (resolve) => {
            const sslMethodListener = new SSLMethodListener(this._host, this._port, new SSLReport());
            await sslMethodListener.run();
            this._results = sslMethodListener.results;
            resolve();
        });
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

    public static fromArgs(content: string) {
        return null;
    }
}