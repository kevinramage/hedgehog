import { ResultItem } from "./resultItem";

export class Result {

    public name : string;
    public errorMessage : string;
    public items : ResultItem[];

    constructor(name: string) {
        this.name = name;
        this.errorMessage = "";
        this.items = [];
    }

    toString() {
        return JSON.stringify(this);
    }
}