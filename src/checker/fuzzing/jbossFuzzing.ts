import { FuzzingChecker, FUZZING_NAME } from "./fuzzingChecker";

import JBOSS_PATHS = require("../../config/fuzzing/jBoss.json");

export class JBossFuzzing extends FuzzingChecker {

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
        super._paths = JBOSS_PATHS as string[];
        super.run();
    }
}