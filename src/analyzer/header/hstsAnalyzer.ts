import { Context } from "../../common/business/request/context";
import { IAnalyzer } from "../IAnalyzer";

/*
 * HTTP Strict Transport Security (HSTS) is a web security policy mechanism which helps to protect websites against protocol downgrade attacks and cookie hijacking
 * Force HTTPS on all resources / Must be add on all responses
 * Check the Strict-Transport-Security header presence (SEVERE)
 */
export class HSTSAnalyzer implements IAnalyzer {
    
    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        throw new Error("Method not implemented.");
    }
    
    public get NAME() {
        return "HSTS";
    }
}