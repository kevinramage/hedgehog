
import { IChecker } from "../IChecker";
import { PortResult } from "../../common/business/checker/portResult";
import { PortListener } from "../../common/business/checker/portListener";
import { PortReport } from "../../common/business/report/portReport";

/**
 * Checker to analyze the server port allowed
 * ///TODO Refacto
 */
export class PortListenerChecker implements IChecker {

    private _host : string;
    private _ports : number[];
    private _results : PortResult[];

    /**
     * Constructor
     * @param host host to test
     * @param port ports to test
     */
    constructor(host: string, ports: number[]) {
        this._host = host;
        this._ports = ports;
        this._results = [];
    }

    /**
     * Run the checker execution
     * TODO: Improve it with parallel execution
     */
    run(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            const portListener = new PortListener(this._host, this._ports, new PortReport());
            await portListener.run();
            this._results = portListener.results;
            resolve();
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