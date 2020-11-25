import { Context } from "../../common/business/context";
import { IAnalyzer } from "../IAnalyzer";

/**
 * The X-Frame-Options response header improves the protection of web applications against clickjacking. It instructs the browser whether the content can be displayed within frames.
 * https://tools.ietf.org/html/rfc7034#section-2.1
 * 
 * - If the header X-Frame-Options is present in response, the header value must have a valid syntax (DENY, SAMESITE, ALLOW-FROM: https://example.com), wildcare not allow
 * - If a frame , iframe, object or embed tag is present in HTML page, the header must be present
 */
export class XFrameOptionsAnalyzer implements IAnalyzer {
    
    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        throw new Error("Method not implemented.");
    }
    
    public get NAME() {
        return "XFRAME_OPTIONS";
    }
}