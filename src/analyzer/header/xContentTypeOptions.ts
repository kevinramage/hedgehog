import { Context } from "../../common/business/request/context";
import { IAnalyzer } from "../IAnalyzer";

/**
 * Setting this header will prevent the browser from interpreting files as a different MIME type to what is specified in the Content-Type HTTP header (e.g. treating text/plain as text/css).
 * - Check if the header is present and the syntax matches
 */

export class XContentTypeOptions implements IAnalyzer{
    
    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        throw new Error("Method not implemented.");
    }

    public get NAME() {
        return "X_CONTENT_TYPE_OPTIONS";
    }
    
}