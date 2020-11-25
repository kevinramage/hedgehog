import { Context } from "../../common/business/context";
import { IAnalyzer } from "../IAnalyzer";

/**
 * ///TODO
 * https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
 */
export class AntiCSRFAnalyzer implements IAnalyzer {
    
    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        throw new Error("Method not implemented.");
    }

    public get NAME() {
        return "ANTI_CSRF";
    }

}