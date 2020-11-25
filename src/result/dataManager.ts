import { closeSync, existsSync, fstat, mkdirSync, openSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { Test } from "./test";
import { Technology } from "./technology";
import { Warning } from "./warning";
import { format } from "util";
import { Defect } from "./defect";

export class DataManager {

    private static _instance : DataManager;
    private _host ?: string;
    private _port ?: number;
    private _technologies : Technology[];
    private _warnings : Warning[];
    private _tests : Test[];
    private _defects : Defect[];

    private constructor() {
        this._technologies = [];
        this._warnings = [];
        this._tests = [];
        this._defects = [];
    }

    public init(host: string) {
        this._host = host;
        if ( !existsSync("data")) { mkdirSync("data"); }
        this.createHostSession();
        this.loadTechnologies();
        this.loadWarnings();
        this.loadTests();
        this.loadDefects();
    }

    private createHostSession() {
        if ( !existsSync(this.dataPath)) { 
            mkdirSync(this.dataPath);
            mkdirSync(this.proofPath);
            closeSync(openSync(this.technologiesPath, "w"));
            closeSync(openSync(this.warningsPath, "w"));
            closeSync(openSync(this.testsPath, "w"));
            closeSync(openSync(this.defectsPath, "w"));
        }
    }

    private loadTechnologies() {
        if ( existsSync(this.technologiesPath) ) {
            const content = readFileSync(this.technologiesPath);
            this._technologies = Technology.load(content.toString());
        }
    }

    public addTechnology(technology: Technology) {
        if ( !Technology.exists(technology, this._technologies)) {
            this._technologies.push(technology);
            this.saveTechnologies();
        }
        this.selectFuzzingSystem(technology.name);
    }

    private saveTechnologies() {
        const content = Technology.save(this._technologies);
        writeFileSync(this.technologiesPath, content);
    }

    private loadWarnings() {
        if ( existsSync(this.warningsPath) ) {
            const content = readFileSync(this.warningsPath);
            this._warnings = Warning.load(content.toString());
        }
    }

    public addWarning(warning: Warning) {
        if ( !Warning.exists(warning, this._warnings)) {
            this._warnings.push(warning);
            this.saveWarnings()
        }
    }

    private saveWarnings() {
        const content = Warning.save(this._warnings);
        writeFileSync(this.warningsPath, content);
    }

    private loadTests() {
        if ( existsSync(this.testsPath) ) {
            const content = readFileSync(this.testsPath);
            this._tests = Test.load(content.toString());
        }
    }

    public addTest(test: Test) {
        if ( !Test.exists(test, this._tests)) {
            this._tests.push(test);
            this.saveTests()
        }
    }

    private saveTests() {
        const content = Test.save(this._tests);
        writeFileSync(this.testsPath, content);
    }

    private loadDefects() {
        if ( existsSync(this.defectsPath) ) {
            const content = readFileSync(this.defectsPath);
            this._defects = Defect.load(content.toString());
        }
    }

    public addDefect(defect: Defect) {
        if ( !Defect.exists(defect, this._defects)) {
            this._defects.push(defect);
            this.saveDefects()
        }
    }

    private saveDefects() {
        const content = Defect.save(this._defects);
        writeFileSync(this.defectsPath, content);
    }

    private selectFuzzingSystem(technology: string) {
        switch ( technology.toLowerCase() ) {
            case "php":
                const test = new Test("PHPFuzzing", format("%s %d", this.host, this.port));
                this.addTest(test);
                break;
        }
    }

    public get host() {
        return this._host as string;
    }

    public get port() {
        return this._port;
    }

    public set port(value) {
        this._port = value;
    }

    public get dataPath() {
        return join("data", this.host);
    }

    public get proofPath() {
        return join("data", this.host, "proofs");
    }

    public get technologiesPath() {
        return join("data", this.host, "technologies.json");
    }

    public get warningsPath() {
        return join("data", this.host, "warning.json");
    }

    public get testsPath() {
        return join("data", this.host, "tests.json");
    }

    public get defectsPath() {
        return join("data", this.host, "defects.json");
    }

    public static get instance() {
        if ( !DataManager._instance ) {
            DataManager._instance = new DataManager();
        }
        return DataManager._instance;
    }
}