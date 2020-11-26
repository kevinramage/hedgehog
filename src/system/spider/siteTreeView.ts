import { SiteTreeViewPage } from "./siteTreeViewPage";

export class SiteTreeView {
    private _rootPage : SiteTreeViewPage;

    constructor() {
        this._rootPage = new SiteTreeViewPage("");
    }

    public includePath(path: string) {
        this._rootPage.includePath(path);
    }

    public toTree() {
        return this.rootPage.toTree("");
    }

    public get rootPage() {
        return this._rootPage;
    }
}