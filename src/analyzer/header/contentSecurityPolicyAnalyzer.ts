import { Context } from "../../common/business/request/context";
import { IAnalyzer } from "../IAnalyzer";

/**
 * Analyze the content security policy
 * A security policy must be defined
 * Avoid allow all option
 * Avoid eval option
 */
export class ContentSecurityPolicyAnalyzer implements IAnalyzer  {

    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        throw new Error("Method not implemented.");
    }

    public get NAME() {
        return "CSP";
    }
}