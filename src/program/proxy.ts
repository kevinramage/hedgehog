import { program } from "commander";
import * as winston from "winston";
import { Program } from "./program";

export class Proxy {

    public run(args: string[]) {
        console.info("Coucou: " + args);
        //.info(Program.instance.arguments);
        if (args.length == 2) {

        } else {
            winston.error("Invalid command proxy, expected <hostName> <port> arguments: ", args);
            //winston.error(program.usage());
        }
    }

}

new Proxy().run(process.argv);