import { Context } from "../../common/business/context";
import { IAnalyzer } from "../IAnalyzer";

/**
 * Analyze comment path from a html page
 * Add warning if path found
 */
export class CommentPathAnalyser implements IAnalyzer {

    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        throw new Error("Method not implemented.");
    }

    public get NAME() {
        return "COMMENT_PATH";
    }
}