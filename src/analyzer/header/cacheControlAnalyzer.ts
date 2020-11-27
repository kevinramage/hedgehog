import { Context } from "../../common/business/request/context";
import { StringUtils } from "../../common/utils/StringUtils";
import { Session } from "../../result/session";
import { Warning, WARNING_NAME, WARNING_SEVERITY, WARNING_TYPE } from "../../result/warning";
import { IAnalyzer } from "../IAnalyzer";
import { DataManager } from "../../result/dataManager";

/**
 * Shared server content cached 
 * "no-store" flag must be provided in Cache-Control header to avoid the server response cached by a proxy server or browser
 * "private" flag must be provided in Cache-Control header to avoid the server response cached by a proxy server or browser
 * Normally HTTPS limit the content sharing
 * Values are case insensitive (RFC-7234)
 */
export class CacheControlAnalyzer implements IAnalyzer {
    
    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        if (context && context.response) {
            const headerValue = context.response.cacheControl;
            if (headerValue && !StringUtils.containsOneOf(headerValue.toLowerCase(), ["private", "no-store"])) {

                // Add warning
                const warning = new Warning(WARNING_TYPE.DATA_EXPOSURE, WARNING_NAME.CACHECONTROL_HEADER, WARNING_SEVERITY.WARNING, headerValue);
                warning.request = context.request;
                warning.response = context.response;
                Session.instance.addWarning(warning);
                DataManager.instance.addWarning(warning);
            }
        }
    }
    
    public get NAME(){
        return "CACHE_CONTROL";
    }
}