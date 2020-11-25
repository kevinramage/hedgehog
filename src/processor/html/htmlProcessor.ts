import { Context } from "../../common/business/context";
import { HtmlPage } from "../../common/business/control/htmlPage";
import { HtmlUtils } from "../../common/utils/htmlUtils";
import { IProcessor } from "../IProcessor";

export class HtmlProcessor implements IProcessor{
    
    process(context: Context): Promise<void> {
        return new Promise<void>((resolve) => {
            if ( context.response.body && context.response.isHtmlResponse ) {
                context.htmlPage = new HtmlPage();
                context.htmlPage.forms = HtmlUtils.extractForm(context.response.body);
                context.htmlPage.h1 = HtmlUtils.extractH1(context.response.body);
                context.htmlPage.h2 = HtmlUtils.extractH2(context.response.body);
                context.htmlPage.h3 = HtmlUtils.extractH3(context.response.body);
                context.htmlPage.h4 = HtmlUtils.extractH4(context.response.body);
                context.htmlPage.h5 = HtmlUtils.extractH5(context.response.body);
                context.htmlPage.h6 = HtmlUtils.extractH6(context.response.body);
                context.htmlPage.links = HtmlUtils.extractLinks(context.response.body);
                context.htmlPage.title = HtmlUtils.extractTitle(context.response.body);
                context.htmlPage.words = HtmlUtils.extractWords(context.response.body);
            }
            resolve();
        });
    }

    public get NAME() {
        return "HTML";
    }
}