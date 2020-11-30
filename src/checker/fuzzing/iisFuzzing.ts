import { FuzzingChecker, FUZZING_NAME } from "./fuzzingChecker";

import IIS_PATHS = require("../../config/fuzzing/iis.json");

export class IISFuzzing extends FuzzingChecker {

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
     * Run checker
     */
    public async run() {
        super._paths = IIS_PATHS as string[];
        super.run();
    }
}