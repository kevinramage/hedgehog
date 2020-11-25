/*
import { ProgramArgument } from "../../../common/business/programArgument";
import { Program } from "../../../common/business/program";
import { PortsListenerChecker } from "../portsListenerChecker";
import { PrettyPrint } from "../../../common/utils/prettyPrinter";

export class PortsListenerProgram extends Program {

    private static NAME = "PortsListenerProgram";
    private static DESCRIPTION = "Check the port opened on a server";
    private static SERVERNAME = "serverName";
    private static PORT = "port";

    constructor() {
        super(PortsListenerProgram.NAME, PortsListenerProgram.DESCRIPTION);
        this.addArgument(new ProgramArgument("s", "serverName", PortsListenerProgram.SERVERNAME, "Server name to check").required());
        this.addArgument(new ProgramArgument("p", "port", PortsListenerProgram.PORT, "Server ports to check: simple port | list ports to check | port interval").defaultValue("1-3389"));
    }

    protected async execute(args: {[key: string]: string}) {
        const serverName = args[PortsListenerProgram.SERVERNAME];
        const portArg = args[PortsListenerProgram.PORT];
        const check = new PortsListenerChecker(serverName, this.identifyPorts(portArg));
        const result = await check.run();
        new PrettyPrint().run(result);
    }

    private identifyPorts(portArg: string) {
        if ( portArg.includes("-") ) {
            const min = Number.parseInt(portArg.split("-")[0].trim());
            const max = Number.parseInt(portArg.split("-")[1].trim());
            return PortsListenerChecker.getPortsFromInterval(min, max);
        } else if ( portArg.includes(",") ) {
            return portArg.split(",").map(p => { return Number.parseInt(p.trim()) });
        } else {
            return [ Number.parseInt(portArg) ]
        }
    }
}

new PortsListenerProgram().run();
*/