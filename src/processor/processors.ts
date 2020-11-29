import { ComponentProcessor } from "./component/componentProcessor";
import { HtmlProcessor } from "./html/htmlProcessor";
import { IProcessor } from "./IProcessor";

/**
 * @ignore
 */
import processorsConfiguration = require("../config/processors.json");

export class Processors {

    private static _instance : Processors;
    private _processors : IProcessor[];

    private constructor() {
        this._processors = [];
        this._processors.push(new ComponentProcessor());
        this._processors.push(new HtmlProcessor());
    }

    public getAll() {
        const processorsName = processorsConfiguration as string[];
        return this._processors.filter((p) => { return processorsName.includes(p.NAME); });
    }

    public static get instance() {
        if (!Processors._instance) {
            Processors._instance = new Processors();
        }
        return Processors._instance;
    }
}