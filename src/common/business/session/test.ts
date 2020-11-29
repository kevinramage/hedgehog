import * as winston from "winston";

/**
 * Test to execute in attack session
 * During proxy session, analysis identify flaw to confirm with a test
 */
export class Test {
    private _programName : string;
    private _args : string;

    constructor(programName: string, args: string) {
        this._programName = programName;
        this._args = args;
    }

    /**
     * Identify if a test exists or not
     * @param test test to search
     * @param tests session tests
     * @returns true if the test exists false else
     */
    public static exists(test: Test, tests: Test[]) {
        return tests.find(t => {
            return t.programName === test.programName && t.args === test.args;
        }) !== undefined;
    }

    /**
     * Load session tests
     * @param content content of session test file
     * @returns test list
     */
    public static load(content: string) {
        winston.debug("Test.load");
        const tests : Test[] = [];
        try {
            const data = JSON.parse(content) as any[];
            data.forEach(t => {
                tests.push(new Test(t.programName, t.args));
            });
        } catch (ex) {
            winston.error("Test.load - Error during parsing", ex);
        }

        return tests;
    }

    /**
     * Save session test
     * @param tests session tests
     * @returns JSON content
     */
    public static save(tests: Test[]) {
        const testsFormatted = tests.map(t => { return {
            programName: t.programName,
            args: t.args
        }});
        return JSON.stringify(testsFormatted);
    }


    public get programName() {
        return this._programName;
    }

    public set programName(value) {
        this._programName = value;
    }

    public get args() {
        return this._args;
    }

    public set args(value) {
        this._args = value;
    }
}