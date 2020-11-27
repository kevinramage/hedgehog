import { Context } from "../../common/business/request/context";
import { IAnalyzer } from "../IAnalyzer";

/**
 * Analyze response html to check secure flag on each cookie
 * Check the header set-cookie, parse it, if secure flag not set, add warning
 */
export class SecureAnalyzer implements IAnalyzer {
    
    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        throw new Error("Method not implemented.");
    }

    public get NAME() {
        return "SECURE";
    }
}