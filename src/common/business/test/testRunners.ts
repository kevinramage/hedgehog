import * as winston from "winston";
import * as fse from "fs-extra";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { TestRunner } from "./testRunner";
import { Evaluator } from "../evaluator";
import { PrettyPrint } from "../../utils/prettyPrint";

export class TestRunners {
    private _reportName: string;
    private _testsFileName : string[];
    private _template : string;
    private _runners : TestRunner[];
    private _time : number;

    constructor() {
        this._reportName = "myReport.html";
        this._testsFileName = [];
        this._template = "";
        this._runners = [];
        this._time = 0;
    }

    public init() {
        winston.debug("TestRunners.init");
        const buffer = readFileSync("resources/template/test/report.html");
        this._template = buffer.toString();
    }

    public execute() {
        winston.debug("TestRunners.execute");
        return new Promise<void>(async (resolve) => {
            const startDateTime = new Date();

            // Create runners and execute it
            const promises : Promise<void>[] = [];
            for (const testFileName of this._testsFileName) {
                const runner = new TestRunner();
                this._runners.push(runner);
                promises.push(runner.execute(testFileName));
            }
            await Promise.all(promises);

            // Compute duration
            const endDateTime = new Date();
            this._time = endDateTime.getTime() - startDateTime.getTime();

            resolve();
        });
    }

    public writeReport() {
        winston.debug("TestRunners.writeReport");

        // Prepare content
        const testsContent = this._runners.map(r => {
            return r.writeReport();
        }).join("");

        // Collect data
        const executors = this._runners.map(r => { return r.executor});
        const maxCVSS = executors.map(e => { return e.flawScore; }).reduce((a, b) => {
            return (a > b) ? a : b;
        });
        const flaws = executors.filter(e => {return e.status !== "NOT_INJECTED"; }).length;
        const simpleFixs = executors.filter(e => { return e.status !== "NOT_INJECTED" && e.fixComplexity === "simple"}).length;
        const variables = {
            flaws,
            maxCVSS,
            "simpleFix": simpleFixs,
            "tests": this._runners.length,
            "time": PrettyPrint.printTime(this._time)
        }

        // Write test
        let content = this._template.replace("{{__TESTS__}}", testsContent);
        content = Evaluator.evaluate(variables, content);

        // Write report
        const outputDirectory = "output";
        if (!existsSync(outputDirectory)) {
            mkdirSync(outputDirectory);
        }
        writeFileSync(outputDirectory + "/" + this._reportName, content);

        // Copy resources
        fse.copySync("resources/template/test/resources", outputDirectory + "/resources");
    }

    public addTestFileName(testFileName: string) {
        winston.debug("TestRunners.addTestFileName");
        this._testsFileName.push(testFileName);
    }
}