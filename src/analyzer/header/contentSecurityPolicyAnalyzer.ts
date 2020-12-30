import { HEADER_NAME } from "../../common/business/request/header";
import { Warning, WARNING_NAME, WARNING_TYPE, WARNING_SEVERITY } from "../../common/business/session/warning";
import { Context } from "../../common/business/request/context";
import { IAnalyzer } from "../IAnalyzer";
import { DataManager } from "../../common/business/session/dataManager";
import { Session } from "../../common/business/session/session";

/**
 * Analyze the content security policy
 * A security policy must be defined for each HTML resource
 * - can be defined by header or meta tag
 *
 * # Recommandation: Place CSP meta tag before resource loading statements to apply security policy on all elements
 *
 * Avoid allow all option
 * Avoid eval option
 *
 * Content-Security-Policy-Report-Only header ?
 */
export class ContentSecurityPolicyAnalyzer implements IAnalyzer  {

    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        if (context && context.response) {
            const contentSecurityPolicyHeader = context.response.headers.find(h => { return h.key === HEADER_NAME.CONTENTSECURITYPOLICY; });
            if (!contentSecurityPolicyHeader) {

                // Add warning
                const warning = new Warning(WARNING_TYPE.DATA_EXPOSURE, WARNING_NAME.CONTENTSECURITYPOLICY_HEADER, WARNING_SEVERITY.MAJOR, "");
                warning.request = context.request;
                warning.response = context.response;
                Session.instance.addWarning(warning);
                DataManager.instance.addWarning(warning);
            }
        }
    }

    public get NAME() {
        return "CSP";
    }
}