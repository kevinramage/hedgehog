import { v4 } from "uuid";
import { HtmlAttribute } from "./htmlAttribute";

export class HtmlControl {
    private _id: string;
    private _type: string;
    private _html ?: string;
    private _text ?: string;
    private _attributes: HtmlAttribute[];
    private _children: HtmlControl[];
    private _parent ?: HtmlControl;

    constructor(type: string) {
        this._id = v4();
        this._type = type;
        this._attributes = [];
        this._children = [];
    }

    public addAttribute(attribute: HtmlAttribute) {
        this._attributes.push(attribute);
    }

    public addChild(child: HtmlControl) {
        this._children.push(child);
    }

    public addChildren(children: HtmlControl[]) {
        this._children = this._children.concat(children);
    }

    /**
     * Search an attribute from its name
     * @param name attribute name to search
     */
    private findAttributeValueByName(name: string) {
        const attributeSearched = this._attributes.find(a => { return a.key && a.key.toLowerCase() === name.toLowerCase() });
        if (attributeSearched) {
            return attributeSearched.value;
        } else {
            return undefined;
        }
    }

    public get idAtt() {
        return this.findAttributeValueByName("id");
    }

    public get name() {
        return this.findAttributeValueByName("name");
    }

    public get method() {
        return this.findAttributeValueByName("method");
    }

    public get typeAtt() {
        return this.findAttributeValueByName("type");
    }

    public get value() {
        return this.findAttributeValueByName("value");
    }

    public get href() {
        return this.findAttributeValueByName("href");
    }

    public get action() {
        return this.findAttributeValueByName("action");
    }


    public get id() {
        return this._id;
    }
    public get type() {
        return this._type;
    }
    public get html() {
        return this._html;
    }
    public set html(value) {
        this._html = value;
    }
    public get text() {
        return this._text;
    }
    public set text(value) {
        this._text = value;
    }
    public get attributes() {
        return this._html;
    }
    public get children() {
        return this._children;
    }
    public get parent() {
        return this._parent;
    }
    public set parent(value) {
        this._parent = value;
    }
}

export enum CONTROL_TYPE {
    FORM = "FORM",
    INPUT = "INPUT",
    TEXTAREA = "TEXTAREA",
    LINK = "LINK",
    H1 = "H1",
    H2 = "H2",
    H3 = "H3",
    H4 = "H4",
    H5 = "H5",
    H6 = "H6"
}