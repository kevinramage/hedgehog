import * as winston from "winston";
import * as fse from "fs-extra";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { TestRunner } from "./testRunner";

export class TestRunners {
    private _reportName: string;
    private _testsFileName : string[];
    private _template : string;
    private _runners : TestRunner[];

    constructor() {
        this._reportName = "myReport.html";
        this._testsFileName = [];
        this._template = "";
        this._runners = [];
    }

    public init() {
        winston.debug("TestRunners.init");
        const buffer = readFileSync("resources/template/test/report.html");
        this._template = buffer.toString();
    }

    public execute() {
        winston.debug("TestRunners.execute");
        return new Promise<void>(async (resolve) => {
            const promises : Promise<void>[] = [];
            for (const testFileName of this._testsFileName) {
                const runner = new TestRunner();
                this._runners.push(runner);
                promises.push(runner.execute(testFileName));
            }
            await Promise.all(promises);
            resolve();
        });
    }

    public writeReport() {
        winston.debug("TestRunners.writeReport");

        // Prepare content
        const testsContent = this._runners.map(r => {
            return r.writeReport();
        }).join("");

        // Write test
        const content = this._template.replace("{{__TESTS__}}", testsContent);

        // Evaluate

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