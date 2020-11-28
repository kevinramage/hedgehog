import * as net from "net";
import { PortReport } from "../../common/business/report/portReport";
import { Report } from "../../common/business/report/report";
import { format } from "util";
import { IChecker } from "../IChecker";
import { PortResult } from "./portResult";
import { OPTIONS, Options } from "../../common/business/options";

/**
 * Checker to analyze the server port allowed
 * ///TODO Refacto
 */
export class PortListenerChecker implements IChecker {

    private _host : string;
    private _ports : number[];
    private _results : PortResult[];
    private _report : Report;

    /**
     * Constructor
     * @param host host to test
     * @param port ports to test
     */
    constructor(host: string, ports: number[]) {
        this._host = host;
        this._ports = ports;
        this._results = [];
        this._report = new PortReport();
    }

    /**
     * Run the checker execution
     * TODO: Improve it with parallel execution
     */
    run(): Promise<void> {
        return new Promise<void>(async (resolve) => {

            // Write user request
            this._report.writeRequest(this);

            // Run query
            const promises = this._ports.map(p => { return this.checkPort(p); });
            this._results = await Promise.all(promises);

            // Write summary
            this._report.writeSummary(this);

            resolve();
        });
    }

    private checkPort(port: number) {
        return new Promise<PortResult>((resolve) => {
            let responseProvided = false;
            const timeout = Options.instance.option(OPTIONS.PORTLISTENER_TIMEOUT);
            const socket = net.connect(port, this._host);
            if (timeout && timeout !== -1) {
                socket.setTimeout(timeout);
            }
            socket.on("connect", () => {
                responseProvided = true;
                this._report.changeStep(format("Listen %d port", port))
                socket.destroy();
                resolve(new PortResult(port, true));
            });
            socket.on("error", () => {
                responseProvided = true;
                socket.destroy();
                resolve(new PortResult(port, false));
            });
        });
    }

    public get host() {
        return this._host;
    }

    public get ports() {
        return this._ports;
    }

    public get results() {
        return this._results;
    }

    public static getPortsFromInterval(min: number, max: number) {
        if (min <= max) {
            const ports : number[] = [];
            for (let i = min; i < max; i++) {
                ports.push(i);
            }
            return ports;
        } else {
            return [];
        }
    }

    public static fromArgs(content: string) {
        return null;
    }
}