import { Context } from "../../common/business/request/context";
import { IAnalyzer } from "../IAnalyzer";

/**
 * Analyze response html to check http only flag on each cookie
 * Check the header set-cookie, parse it, if httpOnly flag not set, add warning
 */
export class HttpOnlyAnalyzer implements IAnalyzer {
    
    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        throw new Error("Method not implemented.");
    }

    public get NAME() {
        return "HTTP_ONLY";
    }
}