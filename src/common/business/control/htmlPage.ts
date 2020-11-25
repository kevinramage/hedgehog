import { HtmlControl } from "./htmlControl";

export class HtmlPage {
    public forms : HtmlControl[];
    public h1 : HtmlControl[];
    public h2 : HtmlControl[];
    public h3 : HtmlControl[];
    public h4 : HtmlControl[];
    public h5 : HtmlControl[];
    public h6 : HtmlControl[];
    public links : HtmlControl[];

    public title ?: string;
    public words : string[];

    constructor() {
        this.forms = [];
        this.h1 = [];
        this.h2 = [];
        this.h3 = [];
        this.h4 = [];
        this.h5 = [];
        this.h6 = [];
        this.links = [];
        this.words = [];
    }
}