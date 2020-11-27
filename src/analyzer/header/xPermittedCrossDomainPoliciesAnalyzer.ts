import { Context } from "../../common/business/request/context";
import { IAnalyzer } from "../IAnalyzer";

/**
 * Analyze XPermittedCrossDomainPolicies header in response
 */
export class XPermittedCrossDomainPoliciesAnalyzer implements IAnalyzer {

    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        throw new Error("Method not implemented.");
    }

    public get NAME() {
        return "XPERMITTED_CROSS_DOMAIN_POLICIES";
    }
}