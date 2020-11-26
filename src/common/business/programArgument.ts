
import { Command } from "commander";
import { format } from "util";

export class ProgramArgument {
    private _name : string;
    private _shortName : string;
    private _longName : string;
    private _description : string;
    private _defaultValue : string;
    private _required : boolean;

    constructor(shortName: string, longName: string, name: string, description: string) {
        this._shortName = shortName;
        this._longName = longName;
        this._name = name;
        this._description = description;
        this._defaultValue = "";
        this._required = false;
    }

    public run(program: Command) {
        if (this._required) {
            if (this._defaultValue) {
                program.requiredOption(format("-%s, --%s <%s>", this._shortName, this._longName, this._name), this._description, this._defaultValue);
            } else {
                program.requiredOption(format("-%s, --%s <%s>", this._shortName, this._longName, this._name), this._description);
            }
        } else {
            if (this._defaultValue) {
                program.option(format("-%s, --%s <%s>", this._shortName, this._longName, this._name), this._description, this._defaultValue);
            } else {
                program.option(format("-%s, --%s <%s>", this._shortName, this._longName, this._name), this._description);
            }
        }
    }

    public defaultValue(defaultValue: string) {
        this._defaultValue = defaultValue;
        return this;
    }

    public optional() {
        this._required = false;
        return this;
    }

    public required() {
        this._required = true;
        return this;
    }

    public get name() {
        return this._name;
    }
}