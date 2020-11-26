
import { Session } from "../../result/session";
import { Context } from "../../common/business/context";
import { DataManager } from "../../result/dataManager";
import { Warning, WARNING_NAME, WARNING_SEVERITY, WARNING_TYPE } from "../../result/warning";
import { IAnalyzer } from "../IAnalyzer";

/**
 * Add warning if ETagAnalyzer is present in response
 * https://security.stackexchange.com/questions/186482/damage-of-a-leaked-etag
 */
export class ETagAnalyzer implements IAnalyzer {
    
    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        if (context && context.response) {
            const headerValue = context.response.eTag;
            if (headerValue && headerValue.trim() !== "") {

                // Add warning
                const warning = new Warning(WARNING_TYPE.DATA_EXPOSURE, WARNING_NAME.ETAG_HEADER, WARNING_SEVERITY.WARNING, headerValue);
                warning.request = context.request;
                warning.response = context.response;
                Session.instance.addWarning(warning);
                DataManager.instance.addWarning(warning);
            }
        }
    }

    public get NAME(){
        return "ETAG";
    }
}