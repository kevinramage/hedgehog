import { FuzzingChecker, FUZZING_NAME } from "./fuzzingChecker";

import TOMCAT_PATHS = require("../../config/fuzzing/tomcat.json");

export class TomcatFuzzing extends FuzzingChecker {

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
        super._paths = TOMCAT_PATHS as string[];
        super.run();
    }
}