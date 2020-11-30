import { format } from "util";
import { FuzzingChecker, FUZZING_NAME } from "./fuzzingChecker";

import PHP_PATHS = require("../../config/fuzzing/php.json");

/**
 * Fuzzing checker dedicated to PHP technology
 */
export class PHPFuzzing extends FuzzingChecker {

    /**
     * Constructor
     * @param host host to check
     * @param port port to check
     * @param ssl host use SSL or not
     */
    constructor(host: string, port: number, ssl: boolean) {
        super(FUZZING_NAME.COMMON, host, port, ssl, [ 404, 405]);
    }

    /**
     * Run the execution of the checker
     */
    public async run() {
        this._paths = PHP_PATHS as string[];
        super.run();
    }

    public get commandLine() {
        return format("PHPFuzzing %s %d", this.host, this.port);
    }

    public static fromArgs(content: string) : PHPFuzzing | null {
        const args = content.split(" ");
        if (args.length === 2) {
            const host = args[0];
            const port = Number.parseInt(args[1], 10);
            if (!isNaN(port)) {
                // return new PHPFuzzing(host, port, );
            }
        }
        return null;
    }
}