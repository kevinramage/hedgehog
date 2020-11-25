/*
import { Result } from "../../common/business/result";
import { PortListenerChecker, PortListenerResultItem } from "./portListenerChecker";

export class PortsListenerChecker {
    public static NAME = "PortsListenerChecker";

    private _host : string;
    private _ports : Array<number>;

    constructor(host: string, ports: Array<number>) {
        this._host = host;
        this._ports = ports;
    }

    public run() {
        return new Promise<PortListenerResult>((resolve) => {
            const instance = this;
            const promises = this._ports.map(async p => {
                return await new PortListenerChecker(instance._host, p).check();
            });
            Promise.all(promises).then((result) => {
                resolve(PortListenerResult.merge(result));
            }).catch((err) => {
                console.error("PortsListenerChecker.check");
                console.error(err);
                resolve(PortListenerResult.merge([]));
            });
        });
    }

    static getPortsFromInterval(min: number, max: number) {
        if ( min <= max ) {
            const ports : Array<number> = [];
            for ( var i = min; i < max; i++) {
                ports.push(i);
            }
            return ports;
        } else {
            return [];
        }
    }
}

export class PortListenerResult extends Result {

    public host : string;
    public ports : string;

    constructor() {
        super(PortsListenerChecker.NAME);
        this.host = "";
        this.ports = "";
    }

    static merge(results: PortListenerResultItem[]) {
        const mergedResults = new PortListenerResult();
        if ( results && results.length > 0 ) {
            const host = results[0].host;
            const ports = results.filter(r => { return r.isListening; }).map(r => { return r.port; }).join(", ");
            mergedResults.host = host;
            mergedResults.ports = ports;
            //mergedResults.items = results;
        }
        return mergedResults;
    }
}
*/