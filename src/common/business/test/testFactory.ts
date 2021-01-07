import * as winston from "winston";
import { SQLAndInjector } from "./executor/SQLAndInjector";
import { SQLErrorInjector } from "./executor/SQLErrorInjector";
import { SQLOrInjector } from "./executor/SQLOrInjector";
import { SQLTimeInjector } from "./executor/SQLTimeInjector";
import { TestExecutor } from "./testExecutor";

export class TestFactory {

    private _instances : {[key: string] : TestExecutor} = {};

    constructor() {
        this.register(SQLOrInjector.executorName, new SQLOrInjector());
        this.register(SQLAndInjector.executorName, new SQLAndInjector());
        this.register(SQLErrorInjector.executorName, new SQLErrorInjector());
        this.register(SQLTimeInjector.executorName, new SQLTimeInjector());
    }

    public register(name: string, instance: TestExecutor) {
        winston.debug("TestFactory.register: " + name);
        this._instances[name] = instance;
    }

    public getExecutor(name: string) {
        winston.debug("TestFactory.getExecutor: " + name);
        return this._instances[name];
    }

    private static _instance : TestFactory;
    public static get instance() {
        if (!TestFactory._instance) {
            TestFactory._instance = new TestFactory();
        }
        return TestFactory._instance;
    }
}