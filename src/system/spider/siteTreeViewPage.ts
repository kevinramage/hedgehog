import { format } from "util";

export class SiteTreeViewPage {
    private _path : string;
    private _subPages : SiteTreeViewPage[];

    constructor(path: string) {
        this._path = path;
        this._subPages = [];
    }

    public includePath(path: string) {
        this.includePathItem(path);
    }

    private includePathItem(path: string) {
        const subPage = this._subPages.find(page => { return page.path == this.getSubPathItems(path)[0]; });
        const subPath = "/" + this.getSubPathItems(path).slice(1).join("/");

        // Page found
        if ( subPage ) {
            subPage.includePath(subPath);

        // Add new page
        } else if ( this.getSubPathItems(path).length > 0 ) {
            const newSubPage = new SiteTreeViewPage(this.getSubPathItems(path)[0]);
            newSubPage.includePath(subPath);
            this._subPages.push(newSubPage);
        }
    }

    public getSubPathItems(path: string) {
        return path.split("/").filter(p => { return p != "" });
    }

    public toTree(tab: string) {
        const newTab = (this.path == "" ? "" : "    ");
        var content = "";
        if ( this.path != "" ) {
            content += format("%s|___%s\n", tab, this.path);
        }
        this.subPages.forEach(page => {
            content += page.toTree(tab + newTab);
        });
        return content;
    }

    public get path() {
        return this._path;
    }

    public get subPages() {
        return this._subPages;
    }
}