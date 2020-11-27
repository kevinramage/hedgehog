import { SequenceItem } from "./sequenceItem";

export class Sequence {
    private _items : SequenceItem[];

    constructor() {
        this._items = [];
    }

    public addElement(item: SequenceItem) {
        this._items.push(item);
    }

    public get items() {
        return this._items;
    }
}