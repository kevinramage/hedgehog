import { closeSync, existsSync, mkdirSync, openSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { Test } from "./test";
import { Technology } from "./technology";
import { Warning } from "./warning";
import { format } from "util";
import { Defect } from "./defect";

/**
 * Represent data linked to host
 * Results of proxy and attack system (technology, warnings, tests, defects)
 */
export class DataManager {

    private static _instance : DataManager;
    private _host ?: string;
    private _port ?: number;
    private _technologies : Technology[];
    private _warnings : Warning[];
    private _tests : Test[];
    private _defects : Defect[];

    /**
     * Constructor
     */
    private constructor() {
        this._technologies = [];
        this._warnings = [];
        this._tests = [];
        this._defects = [];
    }

    /**
     * Init data manager with an host
     * @param host host to initialized
     */
    public init(host: string) {
        this._host = host;
        if (!existsSync("data")) { mkdirSync("data"); }
        this.createHostSession();
        this.loadTechnologies();
        this.loadWarnings();
        this.loadTests();
        this.loadDefects();
    }

    /**
     * Create an host session
     * Initialize files
     */
    private createHostSession() {
        if (!existsSync(this.dataPath)) {
            mkdirSync(this.dataPath);
            mkdirSync(this.proofPath);
            closeSync(openSync(this.technologiesPath, "w"));
            closeSync(openSync(this.warningsPath, "w"));
            closeSync(openSync(this.testsPath, "w"));
            closeSync(openSync(this.defectsPath, "w"));
        }
    }

    /**
     * Load technologies from session file
     */
    private loadTechnologies() {
        if (existsSync(this.technologiesPath)) {
            const content = readFileSync(this.technologiesPath);
            this._technologies = Technology.load(content.toString());
        }
    }

    /**
     * Add technology to session
     * @param technology technology to add
     */
    public addTechnology(technology: Technology) {
        if (!Technology.exists(technology, this._technologies)) {
            this._technologies.push(technology);
            this.saveTechnologies();
        }
        this.selectFuzzingSystem(technology.name);
    }

    private saveTechnologies() {
        const content = Technology.save(this._technologies);
        writeFileSync(this.technologiesPath, content);
    }

    /**
     * Load warnings from session file
     */
    private loadWarnings() {
        if (existsSync(this.warningsPath)) {
            const content = readFileSync(this.warningsPath);
            this._warnings = Warning.load(content.toString());
        }
    }

    /**
     * Add warning to session
     * @param warning warning to add
     */
    public addWarning(warning: Warning) {
        if (!Warning.exists(warning, this._warnings)) {
            this._warnings.push(warning);
            this.saveWarnings()
        }
    }

    /**
     * Save warnings to session
     */
    private saveWarnings() {
        const content = Warning.save(this._warnings);
        writeFileSync(this.warningsPath, content);
    }

    /**
     * Load tests from session file
     */
    private loadTests() {
        if (existsSync(this.testsPath)) {
            const content = readFileSync(this.testsPath);
            this._tests = Test.load(content.toString());
        }
    }

    /**
     * Add test to session
     * @param test test to add
     */
    public addTest(test: Test) {
        if (!Test.exists(test, this._tests)) {
            this._tests.push(test);
            this.saveTests()
        }
    }

    /**
     * Save tests to session
     */
    private saveTests() {
        const content = Test.save(this._tests);
        writeFileSync(this.testsPath, content);
    }

    /**
     * Load defects from session file
     */
    private loadDefects() {
        if (existsSync(this.defectsPath)) {
            const content = readFileSync(this.defectsPath);
            this._defects = Defect.load(content.toString());
        }
    }

    /**
     * Add defect to session
     * @param defect defect to add
     */
    public addDefect(defect: Defect) {
        if (!Defect.exists(defect, this._defects)) {
            this._defects.push(defect);
            this.saveDefects()
        }
    }

    /**
     * Save defects to session
     */
    private saveDefects() {
        const content = Defect.save(this._defects);
        writeFileSync(this.defectsPath, content);
    }

    /**
     * Select the fuzzing system from technology identified
     * @param technology technology identified
     */
    private selectFuzzingSystem(technology: string) {
        switch (technology.toLowerCase()) {
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

    /**
     * Get data path
     */
    public get dataPath() {
        return join("data", this.host);
    }

    /**
     * Get proof path
     */
    public get proofPath() {
        return join("data", this.host, "proofs");
    }

    /**
     * Get technologies path
     */
    public get technologiesPath() {
        return join("data", this.host, "technologies.json");
    }

    /**
     * Get warnings path
     */
    public get warningsPath() {
        return join("data", this.host, "warning.json");
    }

    /**
     * Get tests path
     */
    public get testsPath() {
        return join("data", this.host, "tests.json");
    }

    /**
     * Get defects path
     */
    public get defectsPath() {
        return join("data", this.host, "defects.json");
    }

    /**
     * Get the unique instance (Singleton)
     */
    public static get instance() {
        if (!DataManager._instance) {
            DataManager._instance = new DataManager();
        }
        return DataManager._instance;
    }
}