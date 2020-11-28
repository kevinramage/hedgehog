import commander, { program } from "commander";
import { readFileSync } from "fs";
import { ProxySystem } from "../system/proxy/proxySystem";
import * as winston from "winston";
import { PortListenerChecker } from "../checker/port/portListenerChecker";
import { SSLMethodChecker } from "../checker/sslMethod/sslMethodChecker";
import { CipherChecker } from "../checker/cipher/cipherChecker";

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
                winston.error("pproxy <hostName> <port>  run proxy system to analyze incomming request");
                resolve();
            });

        // Spider
        // Attack

        // Ports checkers
        myProgram.command("ports <hostName> <portRange>")
            .description("run ports checker to identify open ports")
            .action(async (hostName, portRange) => {
                await this.port(hostName, portRange);
                resolve();
            }).exitOverride(() => {
                winston.error("Syntax: proxy <hostName> <portRange>  run ports checker to identify open ports");
                resolve();
            });

        // SSL Method checker
        myProgram.command("ssl <hostName> <port>")
            .description("run ssl methods checker to identify ssl method allowed")
            .action(async (hostName, port) => {
                await this.ssl(hostName, port);
                resolve();
            }).exitOverride(() => {
                winston.error("Syntax: ssl <hostName> <port>  run ssl methods checker to identify ssl method allowed");
                resolve();
            });

        // Cipher checker
        myProgram.command("cipher <hostName> <port>")
            .description("run cipher checker to identify ciphers allowed")
            .action(async (hostName, port) => {
                await this.cipher(hostName, port);
                resolve();
            }).exitOverride(() => {
                winston.error("Syntax: cipher <hostName> <port>  run cipher checker to identify ciphers allowed");
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
            winston.error("proxy <hostName> <port>  run proxy system to analyze incomming request");
        }
    }

    public async port(hostname: string, portArg: string) {
        if (hostname !== "" && portArg !== "") {
            const regexPortList = /^(\s*[0-9]+\s*(\,\s*[0-9]+\s*)*)$/g;
            const regexPortRange = /^\s*[0-9]+\s*\-\s*[0-9]+\s*$/g;
            const uniquePort = Number.parseInt(portArg, 10);

            // List (22, 80, 443)
            if (portArg.match(regexPortList) != null) {
                const ports = portArg.split(",").
                    map((p) => { return Number.parseInt(p, 10); })
                    .filter(p => { return !Number.isNaN(p); });
                const portListener = new PortListenerChecker(hostname, ports);
                await portListener.run();

            // Interval (22-80)
            } else if (portArg.match(regexPortRange) != null) {
                const min = Number.parseInt(portArg.split("-")[0].trim(), 10);
                const max = Number.parseInt(portArg.split("-")[1].trim(), 10);
                const ports = PortListenerChecker.getPortsFromInterval(min, max);
                const portListener = new PortListenerChecker(hostname, ports);
                await portListener.run();

            // Single port
            } else if (!isNaN(uniquePort)) {
                const portListener = new PortListenerChecker(hostname, [uniquePort]);
                await portListener.run();
            } else {
                winston.error("Invalid syntax: ports <hostName> <portRange>  run ports checker to identify open ports");
            }

        } else {
            winston.error("Invalid syntax: ports <hostName> <portRange>  run ports checker to identify open ports");
        }
    }

    public async ssl(hostName: string, portValue: string) {
        const port = Number.parseInt(portValue, 10);
        if (!isNaN(port)) {
            const sslMethodChecker = new SSLMethodChecker(hostName, port);
            await sslMethodChecker.run();
        } else {
            winston.error("Syntax: ssl <hostName> <port>  run ssl methods checker to identify ssl method allowed");
        }
    }

    public async cipher(hostName: string, portValue: string) {
        const port = Number.parseInt(portValue, 10);
        if (!isNaN(port)) {
            const cipherChecker = new CipherChecker(hostName, port);
            await cipherChecker.run();
        } else {
            winston.error("Syntax: cipher <hostName> <port>  run cipher checker to identify ciphers allowed");
        }
    }

    public static get instance() {
        if (!Program._instance) {
            Program._instance = new Program();
        }
        return Program._instance;
    }
}