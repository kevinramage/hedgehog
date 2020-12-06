import commander, { program } from "commander";
import { ProxySystem } from "../system/proxy/proxySystem";
import { PortListenerChecker } from "../checker/port/portListenerChecker";
import { SSLMethodChecker } from "../checker/sslMethod/sslMethodChecker";
import { CipherChecker } from "../checker/cipher/cipherChecker";
import { MethodChecker } from "../checker/method/methodChecker";
import { CommonFuzzing } from "../checker/fuzzing/commonFuzzing";
import { ApacheFuzzing } from "../checker/fuzzing/apacheFuzzing";
import { ColdFusionFuzzing } from "../checker/fuzzing/coldFusionFuzzing";
import { IISFuzzing } from "../checker/fuzzing/iisFuzzing";
import { JBossFuzzing } from "../checker/fuzzing/jbossFuzzing";
import { PHPFuzzing } from "../checker/fuzzing/phpFuzzing";
import { TomcatFuzzing } from "../checker/fuzzing/tomcatFuzzing";
import { CertificateChecker } from "../checker/certificate/certificateChecker";
import { HedgeHogInfo } from "../common/business/hedgehogInfo";

import * as winston from "winston";

export class Program {

    private static _instance : Program;

    public run() {
        winston.debug("Program.run");
        return new Promise<void>((resolve) => {

            const myProgram = program;

            // Create commands
            this.defineProgramInformations(myProgram);
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
                winston.error("proxy <hostName> <port>  run proxy system to analyze incomming request");
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
        myProgram.command("cipher <hostName> <port> <path>")
            .description("run cipher checker to identify ciphers allowed")
            .action(async (hostName, port, path) => {
                await this.cipher(hostName, port, path);
                resolve();
            }).exitOverride(() => {
                winston.error("Syntax: cipher <hostName> <port> <path>  run cipher checker to identify ciphers allowed");
                resolve();
            });

        // Method checker
        myProgram.command("method <hostName> <port> <ssl> <path>")
        .description("run method checker to identify method allowed")
        .action(async (hostName, port, ssl, path) => {
            await this.method(hostName, port, ssl, path);
            resolve();
        }).exitOverride(() => {
            winston.error("Syntax: method <hostName> <port> <ssl> <path>  run method checker to identify method allowed");
            resolve();
        });

        // Apache fuzzing checker
        myProgram.command("apacheFuzzing <hostName> <port> <ssl>")
        .description("run apache fuzzing checker to identify exposed path")
        .action(async (hostName, port, ssl) => {
            await this.apacheFuzzing(hostName, port, ssl);
            resolve();
        }).exitOverride(() => {
            winston.error("Syntax: apacheFuzzing <hostName> <port> <ssl>  run apache fuzzing checker to identify exposed path");
            resolve();
        });

        // Cold Fusion fuzzing checker
        myProgram.command("coldFusionFuzzing <hostName> <port> <ssl>")
        .description("run cold fusion fuzzing checker to identify exposed path")
        .action(async (hostName, port, ssl) => {
            await this.coldFusion(hostName, port, ssl);
            resolve();
        }).exitOverride(() => {
            winston.error("Syntax: coldFusionFuzzing <hostName> <port> <ssl>  run cold fusion fuzzing checker to identify exposed path");
            resolve();
        });

        // Common fuzzing checker
        myProgram.command("commonFuzzing <hostName> <port> <ssl>")
        .description("run common fuzzing checker to identify exposed path")
        .action(async (hostName, port, ssl) => {
            await this.commonFuzzing(hostName, port, ssl);
            resolve();
        }).exitOverride(() => {
            winston.error("Syntax: commonFuzzing <hostName> <port> <ssl>  run common fuzzing checker to identify exposed path");
            resolve();
        });

        // IIS fuzzing checker
        myProgram.command("iisFuzzing <hostName> <port> <ssl>")
        .description("run IIS fuzzing checker to identify exposed path")
        .action(async (hostName, port, ssl) => {
            await this.iis(hostName, port, ssl);
            resolve();
        }).exitOverride(() => {
            winston.error("Syntax: iisFuzzing <hostName> <port> <ssl>  run IIS fuzzing checker to identify exposed path");
            resolve();
        });

        // JBoss fuzzing checker
        myProgram.command("jBossFuzzing <hostName> <port> <ssl>")
        .description("run jBoss fuzzing checker to identify exposed path")
        .action(async (hostName, port, ssl) => {
            await this.jboss(hostName, port, ssl);
            resolve();
        }).exitOverride(() => {
            winston.error("Syntax: jBossFuzzing <hostName> <port> <ssl>  run jBoss fuzzing checker to identify exposed path");
            resolve();
        });

        // PHP fuzzing checker
        myProgram.command("phpFuzzing <hostName> <port> <ssl>")
        .description("run PHP fuzzing checker to identify exposed path")
        .action(async (hostName, port, ssl) => {
            await this.php(hostName, port, ssl);
            resolve();
        }).exitOverride(() => {
            winston.error("Syntax: phpFuzzing <hostName> <port> <ssl>  run PHP fuzzing checker to identify exposed path");
            resolve();
        });

        // Tomcat fuzzing checker
        myProgram.command("tomcatFuzzing <hostName> <port> <ssl>")
        .description("run tomcat fuzzing checker to identify exposed path")
        .action(async (hostName, port, ssl) => {
            await this.tomcat(hostName, port, ssl);
            resolve();
        }).exitOverride(() => {
            winston.error("Syntax: tomcatFuzzing <hostName> <port> <ssl>  run tomcat fuzzing checker to identify exposed path");
            resolve();
        });

        // Certificate checker
        myProgram.command("certificate <hostName> <port>")
        .description("run certificate checker to validate the server SSL certificate")
        .action(async (hostName, port) => {
            await this.certificate(hostName, port);
            resolve();
        }).exitOverride(() => {
            winston.error("Syntax: certificate <hostName> <port>  run certificate checker to validate the server SSL certificate");
            resolve();
        });
    }

    private defineProgramInformations(myProgram: commander.Command) {
        winston.debug("Program.defineProgramInformations");
        myProgram.description(HedgeHogInfo.description);
        myProgram.version(HedgeHogInfo.version);
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

    public async cipher(hostName: string, portValue: string, path: string) {
        const port = Number.parseInt(portValue, 10);
        if (!isNaN(port)) {
            const cipherChecker = new CipherChecker(hostName, port, path);
            await cipherChecker.run();
        } else {
            winston.error("Syntax: cipher <hostName> <port> <path>  run cipher checker to identify ciphers allowed");
        }
    }

    public async method(hostName: string, portValue: string, ssl: boolean, path: string) {
        const port = Number.parseInt(portValue, 10);
        if (!isNaN(port)) {
            const methodChecker = new MethodChecker(hostName, port, ssl, path);
            await methodChecker.run();
        } else {
            winston.error("Syntax: method <hostName> <port> <ssl> <path>  run method checker to identify method allowed");
        }
    }

    public async apacheFuzzing(hostName: string, portValue: string, sslValue: string) {
        const sslArg = sslValue ? sslValue.toLocaleLowerCase() : "";
        const port = Number.parseInt(portValue, 10);
        const ssl : boolean | null = (sslArg !== "true") ? (sslArg === "false" ? false : null) : true;
        if (!isNaN(port)) {
            if (ssl != null) {
                const apacheFuzzing = new ApacheFuzzing(hostName, port, ssl);
                await apacheFuzzing.run();
            } else {
                winston.error("Syntax: apacheFuzzing <hostName> <port> <ssl>  run apache fuzzing checker to identify exposed path");
            }
        } else {
            winston.error("Syntax: apacheFuzzing <hostName> <port> <ssl>  run apache fuzzing checker to identify exposed path");
        }
    }

    public async coldFusion(hostName: string, portValue: string, sslValue: string) {
        const sslArg = sslValue ? sslValue.toLocaleLowerCase() : "";
        const port = Number.parseInt(portValue, 10);
        const ssl : boolean | null = (sslArg !== "true") ? (sslArg === "false" ? false : null) : true;
        if (!isNaN(port)) {
            if (ssl != null) {
                const coldFusionFuzzing = new ColdFusionFuzzing(hostName, port, ssl);
                await coldFusionFuzzing.run();
            } else {
                winston.error("Syntax: coldFusionFuzzing <hostName> <port> <ssl>  run cold fusion fuzzing checker to identify exposed path");
            }
        } else {
            winston.error("Syntax: coldFusionFuzzing <hostName> <port> <ssl>  run cold fusion fuzzing fuzzing checker to identify exposed path");
        }
    }

    public async commonFuzzing(hostName: string, portValue: string, sslValue: string) {
        const sslArg = sslValue ? sslValue.toLocaleLowerCase() : "";
        const port = Number.parseInt(portValue, 10);
        const ssl : boolean | null = (sslArg !== "true") ? (sslArg === "false" ? false : null) : true;
        if (!isNaN(port)) {
            if (ssl != null) {
                const commonFuzzing = new CommonFuzzing(hostName, port, ssl);
                await commonFuzzing.run();
            } else {
                winston.error("Syntax: commonFuzzing <hostName> <port> <ssl>  run common fuzzing checker to identify exposed path");
            }
        } else {
            winston.error("Syntax: commonFuzzing <hostName> <port> <ssl>  run common fuzzing checker to identify exposed path");
        }
    }

    public async iis(hostName: string, portValue: string, sslValue: string) {
        const sslArg = sslValue ? sslValue.toLocaleLowerCase() : "";
        const port = Number.parseInt(portValue, 10);
        const ssl : boolean | null = (sslArg !== "true") ? (sslArg === "false" ? false : null) : true;
        if (!isNaN(port)) {
            if (ssl != null) {
                const iisFuzing = new IISFuzzing(hostName, port, ssl);
                await iisFuzing.run();
            } else {
                winston.error("Syntax: iisFuzing <hostName> <port> <ssl>  run IIS fuzzing checker to identify exposed path");
            }
        } else {
            winston.error("Syntax: iisFuzing <hostName> <port> <ssl>  run IIS fuzzing checker to identify exposed path");
        }
    }

    public async jboss(hostName: string, portValue: string, sslValue: string) {
        const sslArg = sslValue ? sslValue.toLocaleLowerCase() : "";
        const port = Number.parseInt(portValue, 10);
        const ssl : boolean | null = (sslArg !== "true") ? (sslArg === "false" ? false : null) : true;
        if (!isNaN(port)) {
            if (ssl != null) {
                const jBossFuzzing = new JBossFuzzing(hostName, port, ssl);
                await jBossFuzzing.run();
            } else {
                winston.error("Syntax: jBossFuzzing <hostName> <port> <ssl>  run JBoss fuzzing checker to identify exposed path");
            }
        } else {
            winston.error("Syntax: jBossFuzzing <hostName> <port> <ssl>  run JBoss fuzzing checker to identify exposed path");
        }
    }

    public async php(hostName: string, portValue: string, sslValue: string) {
        const sslArg = sslValue ? sslValue.toLocaleLowerCase() : "";
        const port = Number.parseInt(portValue, 10);
        const ssl : boolean | null = (sslArg !== "true") ? (sslArg === "false" ? false : null) : true;
        if (!isNaN(port)) {
            if (ssl != null) {
                const phpFuzzing = new PHPFuzzing(hostName, port, ssl);
                await phpFuzzing.run();
            } else {
                winston.error("Syntax: phpFuzzing <hostName> <port> <ssl>  run PHP fuzzing checker to identify exposed path");
            }
        } else {
            winston.error("Syntax: phpFuzzing <hostName> <port> <ssl>  run PHP fuzzing checker to identify exposed path");
        }
    }

    public async tomcat(hostName: string, portValue: string, sslValue: string) {
        const sslArg = sslValue ? sslValue.toLocaleLowerCase() : "";
        const port = Number.parseInt(portValue, 10);
        const ssl : boolean | null = (sslArg !== "true") ? (sslArg === "false" ? false : null) : true;
        if (!isNaN(port)) {
            if (ssl != null) {
                const tomcatFuzzing = new TomcatFuzzing(hostName, port, ssl);
                await tomcatFuzzing.run();
            } else {
                winston.error("Syntax: tomcatFuzzing <hostName> <port> <ssl>  run tomcat fuzzing checker to identify exposed path");
            }
        } else {
            winston.error("Syntax: tomcatFuzzing <hostName> <port> <ssl>  run tomcat fuzzing checker to identify exposed path");
        }
    }

    public async certificate(hostName: string, portValue: string) {
        const port = Number.parseInt(portValue, 10);
        if (!isNaN(port)) {
            const certificateChecker = new CertificateChecker(hostName, port);
            await certificateChecker.run();
        } else {
            winston.error("Syntax: certificate <hostName> <port>  run certificate checker to validate the server SSL certificate");
        }
    }

    public static get instance() {
        if (!Program._instance) {
            Program._instance = new Program();
        }
        return Program._instance;
    }
}