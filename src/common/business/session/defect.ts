import { Sequence } from "../request/sequence";
import * as winston from "winston";

/**
 * Represent an unexpected behaviour, probably a security issue
 */
export class Defect {
    private _test : string;
    private _path : string;
    private _expected : string;
    private _actual : string;
    private _sequence : Sequence;

    /**
     * Constructor
     * @param test test executed
     * @param path path ?
     * @param expected expected value
     * @param actual actual value
     */
    constructor(test: string, path: string, expected: string, actual: string) {
        this._test = test;
        this._path = path;
        this._expected = expected;
        this._actual = actual;
        this._sequence = new Sequence();
    }

    /**
     * Identify if a defect exists or not
     * @param defect defect to search
     * @param defects session defects
     * @returns true if the defect exists false else
     */
    public static exists(defect: Defect, defects: Defect[]) {
        return defects.find(t => { return t.test === defect.test && t._path === defect.path; }) !== undefined;
    }

    /**
     * Load session defects
     * @param content content of session defect file
     * @returns defect list
     */
    public static load(content: string) {
        winston.debug("Defect.load");
        const defects : Defect[] = [];
        try {
            if (content !== "") {
                const data = JSON.parse(content) as any[];
                data.forEach(t => {
                    defects.push(new Defect(t.test, t.path, t.expected, t.actual));
                });
            }
        } catch (ex) {
            winston.error("Defect.load - Error during parsing", ex);
        }

        return defects;
    }

    /**
     * Save session defects
     * @param defects session defects
     * @returns JSON content
     */
    public static save(defects: Defect[]) {
        const defectsFormatted = defects.map(t => { return {
            test: t._test,
            path: t._path,
            expected: t._expected,
            actual: t._actual
        }});
        return JSON.stringify(defectsFormatted);
    }

    public get test() {
        return this._test;
    }

    public get path() {
        return this._path;
    }

    public get expected() {
        return this._expected;
    }

    public get actual() {
        return this._actual;
    }

    public get sequence() {
        return this._sequence;
    }
}