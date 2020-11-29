import { SequenceItem } from "./sequenceItem";

/**
 * Represent a sequence of request response
 */
export class Sequence {
    private _items : SequenceItem[];

    /**
     * Constructor
     */
    constructor() {
        this._items = [];
    }

    /**
     * Add sequence item
     * @param item sequence item (request and response)
     */
    public addElement(item: SequenceItem) {
        this._items.push(item);
    }

    public get items() {
        return this._items;
    }
}