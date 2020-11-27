import { Context } from "../../common/business/request/context";
import { DataManager } from "../../result/dataManager";
import { Session } from "../../result/session";
import { Warning, WARNING_NAME, WARNING_SEVERITY, WARNING_TYPE } from "../../result/warning";
import { IAnalyzer } from "../IAnalyzer";

/**
 * Feature policy header help to control the available of some browser feature
 * The feature policy header must be present
 * Limit the usage of wildcard for features
 */
export class FeaturePolicyAnalyzer implements IAnalyzer {

    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        
        if (context && context.response) {
            const featurePolicyHeader = context.response.featurePolicy;

            // Feature-Policy header contains wildcard
            if (featurePolicyHeader && featurePolicyHeader.trim() !== "") {
                if (featurePolicyHeader.includes("*")) {
                    this.addWarning(context, featurePolicyHeader);
                }

            // Feature-Policy header is absent
            } else {
                this.addWarning(context, "");
            }
        }
    }

    /**
     * Add warning to session and data manager
     * @param context context analyzed
     * @param headerValue header value received
     */
    private addWarning(context: Context, headerValue: string) {
        const warning = new Warning(WARNING_TYPE.WEAK_ACCESSCONTROL,WARNING_NAME.FEATUREPOLICY_HEADER, headerValue ? WARNING_SEVERITY.MAJOR : WARNING_SEVERITY.WARNING, headerValue);
        warning.request = context.request;
        warning.response = context.response;
        Session.instance.addWarning(warning);
        DataManager.instance.addWarning(warning);
    }
    
    public get NAME() {
        return "FEATURE_POLICY";
    }
}