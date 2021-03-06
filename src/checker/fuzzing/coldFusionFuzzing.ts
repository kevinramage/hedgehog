import { FuzzingChecker, FUZZING_NAME } from "./fuzzingChecker";

import COLDFUSION_PATHS = require("../../config/fuzzing/coldFusion.json");

export class ColdFusionFuzzing extends FuzzingChecker {

    /**
     * Constructor
     * @param host host to check
     * @param port port to check
     * @param ssl host use SSL or not
     */
    constructor(host: string, port: number, ssl: boolean) {
        super(FUZZING_NAME.COMMON, host, port, ssl);
    }

    /**
     * Run checker
     */
    public async run() {
        super._paths = COLDFUSION_PATHS as string[];
        super.run();
    }
}