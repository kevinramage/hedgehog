import { DataManager } from "../../common/business/session/dataManager";
import { Context } from "../../common/business/request/context";
import { Session } from "../../common/business/session/session";
import { Warning, WARNING_NAME, WARNING_SEVERITY, WARNING_TYPE } from "../../common/business/session/warning";
import { IAnalyzer } from "../IAnalyzer";

/**
 * Access-Control-Allow-Origin header must be not equals to wildcard
 * Apply this check to all ressources
 */
export class AccessControlAllowOriginAnalyzer implements IAnalyzer {

    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        if (context && context.response) {
            const headerValue = context.response.accessControlAllowOrigin;
            if (headerValue && headerValue.trim() === "*") {

                // Add warning
                const warning = new Warning(WARNING_TYPE.WEAK_ACCESSCONTROL, WARNING_NAME.ACCESSCONTROLALLOWORIGIN_HEADER, WARNING_SEVERITY.WARNING, headerValue);
                warning.request = context.request;
                warning.response = context.response;
                Session.instance.addWarning(warning);
                DataManager.instance.addWarning(warning);
            }
        }
    }

    public get NAME() {
        return "ACCESS_CONTROL_ORIGIN";
    }
}