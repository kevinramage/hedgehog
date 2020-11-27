import commander, { program } from "commander";
import { readFileSync } from "fs";
import { ProxySystem } from "../system/proxy/proxySystem";
import * as winston from "winston";

export class Program {

    private static _instance : Program;

    public run() {
        winston.debug("Program.run");
        return new Promise<void>((resolve) => {

            const myProgram = program;

            // Create commands
            this.defineProgramInformations(myProgram, resolve);
            this.createCommands(myProgram, resolve);

            // Display help when no command identified
            myProgram.exitOverride(() => {
                winston.error(myProgram.helpInformation());
                resolve();
            });

            // Parse arguments
            myProgram.parse(process.argv);
        });
    }

    private createCommands(myProgram: commander.Command, resolve: () => void) {
        winston.debug("Program.defineProgramCommands");

        // Request

        // Proxy
        myProgram.command("proxy <hostName> <port>")
            .description("run proxy system to analyze incomming request")
            .action(async (hostName, port) => {
                await this.proxy(hostName, port);
                resolve();
            }).exitOverride(() => {
                winston.error("ports <hostName> <port>  run ports checker to identify opened ports");
                resolve();
            });

        // Spider
        // Attack

        // Ports checkers
        myProgram.command("ports <hostName> <port>")
            .description("run ports checker to identify opened ports")
            .action(async (hostName, port) => {
                await this.port(hostName);
                resolve();
            }).exitOverride(() => {
                winston.error("Syntax: proxy <hostName> <port>  run proxy system to analyze incomming request");
                resolve();
            });
    }

    private defineProgramInformations(myProgram: commander.Command, resolve: () => void) {
        winston.debug("Program.defineProgramInformations");
        try {
            const buffer = readFileSync("package.json");
            const data = JSON.parse(buffer.toString());
            myProgram.description(data.description);
            myProgram.version(data.version);
        } catch (err) {
            winston.debug("Program.defineProgramVersion - Internal error: ", err);
            resolve();
        }
    }

    public async proxy(hostName: string, portValue: string) {
        const port = Number.parseInt(portValue, 10);
        if (!isNaN(port)) {
            const proxySystem = new ProxySystem(hostName, port);
            await proxySystem.run();
        } else {
            /// TODO Manage error
        }
    }

    public async port(hostname: string) {
        /// TODO
    }

    public static get instance() {
        if (!Program._instance) {
            Program._instance = new Program();
        }
        return Program._instance;
    }
}