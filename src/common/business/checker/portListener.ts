import * as net from "net";
import { format } from "util";
import { Options, OPTIONS } from "../options";
import { Report } from "../report/report";
import { PortResult } from "./portResult";

export class PortListener {
    private _server : string;
    private _portsToCheck : number[];
    private _report ?: Report;
    private _results : PortResult[];

    constructor(server: string, ports: number[], report ?: Report) {
        this._server = server;
        this._portsToCheck = ports;
        this._results = [];
        this._report = report;
    }

    run() {
        return new Promise<void>(async (resolve) => {

            // Write user request
            if (this._report) {
                this._report.writeRequest(this);
            }

            // Run query
            const promises = this._portsToCheck.map(p => { return this.checkPort(p); });
            this._results = await Promise.all(promises);

            // Write summary
            if (this._report) {
                this._report.writeSummary(this);
            }

            resolve();
        });
    }

    private checkPort(port: number) {
        return new Promise<PortResult>((resolve) => {
            const timeout = Options.instance.option(OPTIONS.PORTLISTENER_TIMEOUT);
            const socket = net.connect(port, this._server);
            if (timeout && timeout !== -1) {
                socket.setTimeout(timeout);
            }
            socket.on("connect", () => {
                if (this._report) {
                    this._report.changeStep(format("Listen %d port", port));
                }
                socket.destroy();
                resolve(new PortResult(port, true));
            });
            socket.on("error", () => {
                socket.destroy();
                resolve(new PortResult(port, false));
            });
        });
    }

    public get results() {
        return this._results;
    }
}