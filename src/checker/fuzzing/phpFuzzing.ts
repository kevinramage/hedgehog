import * as fs from "fs";
import { format } from "util";
import { Fuzzing } from "./fuzzing";

/**
 * Fuzzing checker dedicated to PHP technology
 */
export class PHPFuzzing extends Fuzzing {

    /**
     * Constructor
     * @param host host to test
     * @param port port to test
     * @param expectedStatus array of possible response status code for invalid path (e.g 404, 405)
     */
    constructor(host: string, port: number) {
        super(host, port, [ 404, 405 ]);
    }

    /**
     * Run the execution of the checker
     */
    public async run() {

        // Load payloads
        const content = fs.readFileSync("config/fuzzing/php/php.json").toString();
        const data = JSON.parse(content);

        // Run
        super.paths = data;
        super.run();
    }

    public get commandLine() {
        return format("PHPFuzzing %s %d", this.host, this.port);
    }

    public static fromArgs(content: string) : PHPFuzzing | null {
        const args = content.split(" ");
        if ( args.length == 2 ) {
            const host = args[0];
            const port = Number.parseInt(args[1]);
            if ( !isNaN(port) ) {
                return new PHPFuzzing(host, port);
            }
        }
        return null;
    }
}