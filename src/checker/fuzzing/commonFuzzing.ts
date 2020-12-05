import { FuzzingChecker, FUZZING_NAME } from "./fuzzingChecker";

import COMMON_PATHS = require("../../config/fuzzing/common.json");

export class CommonFuzzing extends FuzzingChecker {

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
     * Run the checker
     */
    public async run() {
        this._paths = COMMON_PATHS as string[];
        return super.run();
    }
}