import { Context } from "../../common/business/context";
import { IAnalyzer } from "../IAnalyzer";

/**
 * Analyze XXSSProtection header in response
 * If this header is not present, add warning
 */
export class XXSSProtectionAnalyzer implements IAnalyzer {
    
    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        throw new Error("Method not implemented.");
    }
    
    public get NAME() {
        return "XXSS_PROTECTION";
    }
}