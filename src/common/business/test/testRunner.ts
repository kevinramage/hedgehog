import { readFile } from "fs";
import * as yaml from "yaml";
import * as winston from "winston";
import { TestFactory } from "./testFactory";
import { ITestDescriptionHeader } from "./testDescriptionHeader";
import { TestExecutor } from "./testExecutor";

export class TestRunner {

    private _executor ?: TestExecutor;

    public execute(fileName: string) {
        winston.debug("TestRunner.execute");
        return new Promise<void>(async (resolve) => {
            try {
                // Create executor
                const testDescription = await this.readTestFile(fileName);
                this._executor = TestFactory.instance.getExecutor(testDescription.test.type);

                // Execute it
                await this._executor.run(testDescription);

            } catch (err) {
                winston.error("TestRunner.execute - Internal error: ", err);
            }
            resolve();
        });
    }

    public writeReport() {
        winston.debug("TestRunner.writeReport");
        return this.executor.writeReport();
    }

    private readTestFile(fileName: string) {
        winston.debug("TestRunner.readTestFile: " + fileName);
        return new Promise<ITestDescriptionHeader>((resolve, reject) => {
            readFile(fileName, (err, buffer) => {
                if (!err) {
                    const data = buffer.toString();
                    try {
                        resolve(yaml.parse(data) as ITestDescriptionHeader);
                    } catch (err) {
                        winston.error("TestRunner.readTestFile - Internal error: ", err);
                        reject(err);
                    }
                } else {
                    winston.error("TestRunner.readTestFile - Internal error: ", err);
                    reject(err);
                }
            });
        });
    }

    private get executor() {
        return this._executor as TestExecutor;
    }
}