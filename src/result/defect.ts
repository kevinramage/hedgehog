import { Sequence } from "../common/business/request/sequence";

export class Defect {
    private _test : string;
    private _path : string;
    private _expected : string;
    private _actual : string;
    private _sequence : Sequence;

    constructor(test: string, path: string, expected: string, actual: string) {
        this._test = test;
        this._path = path;
        this._expected = expected;
        this._actual = actual;
        this._sequence = new Sequence();
    }

    public static exists(defect: Defect, defects: Defect[]) {
        return defects.find(t => { return t.test === defect.test && t._path === defect.path; }) !== undefined;
    }

    public static load(content: string) {
        const defects : Defect[] = [];
        try {
            const data = JSON.parse(content) as any[];
            data.forEach(t => {
                defects.push(new Defect(t.test, t.path, t.expected, t.actual));
            });
        } catch (ex) {
            /// TODO Handling error
        }

        return defects;
    }

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