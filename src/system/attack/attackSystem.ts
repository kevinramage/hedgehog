import { readFileSync } from "fs";
import { Checkers } from "../../checker/checkers";
import { Test } from "../../result/test";
import { format } from "util";
import { Report } from "../../result/report/report";
import { ISystem } from "../ISystem";

export class AttackSystem implements ISystem {

    private _host : string;
    private _report : Report;
    private _tests : Test[];

    constructor(host: string) {
        this._host  = host;
        this._report = new Report();
        this._tests = [];
    }

    public async run() {

        // Read host file
        this.init();

        // Run tests
        await this.runTests();

        // Summarize test results
        this.summarizeTestResults();
    }

    /**
     * Initialize the attack
     * - Display user request
     * - Read file to proceed
     */
    private init() {
        this._report.writeRequest(this);
        const buffer = readFileSync(format("data/%s/tests.json"));
        this._tests = Test.load(buffer.toString());
    }

    private runTests() {
        this._tests.forEach(test => {
            this.runTest(test);
        });
    }

    private runTest(test: Test) {

        // Update report
        this._report.changeStep(format("Run %s with args: %s", test.programName, test.args));

        // Identify checker
        const checker = Checkers.identifyChecker(test.programName, test.args);

        // Run checker
        if (checker) {
            checker.run();
        }
    }

    private summarizeTestResults() {
        /// TO IMPLEMENT
    }

    public get host() {
        return this._host;
    }
}