export class Test {
    private _programName : string;
    private _args : string;

    constructor(programName: string, args: string) {
        this._programName = programName;
        this._args = args;
    }

    public static exists(test: Test, tests: Test[]) {
        return tests.find(t => {
            return t.programName === test.programName && t.args === test.args;
        }) !== undefined;
    }

    public static load(content: string) {
        const tests : Test[] = [];
        try {
            const data = JSON.parse(content) as any[];
            data.forEach(t => {
                tests.push(new Test(t.programName, t.args));
            });
        } catch (ex) {
            /// TODO Handling error
        }

        return tests;
    }

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