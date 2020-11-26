import { Context } from "../../common/business/context";
import { DataManager } from "../../result/dataManager";
import { Technology } from "../../result/technology";
import { IAnalyzer } from "../IAnalyzer";

const ERRORS_PAGE = require("../../config/errorsPage.json");

/**
 * Analyze response html code to detect technology (from classic errors pages database)
 * Add technology if some regex matches
 */
export class ErrorPageAnalyzer implements IAnalyzer{
    
    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        if (context && context.response && context.response.isHtmlResponse) {
            const errors = ERRORS_PAGE as any[];
            errors.forEach((error => {
                if (context.response.inlineBody.match(error.regex)) {
                    const technology = new Technology(error.name, error.version || "");
                    DataManager.instance.addTechnology(technology);
                }
            }));
        }
    }

    public get NAME() {
        return "ERRORS_PAGE";
    }
}