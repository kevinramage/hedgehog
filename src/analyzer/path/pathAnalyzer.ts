import { Context } from "../../common/business/request/context";
import { IAnalyzer } from "../IAnalyzer";

/**
 * Analyze the request and the response to check the path and the status code
 * If the path is a default path (matches from technology path database) add warning
 */
export class PathAnalyzer implements IAnalyzer {

    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        throw new Error("Method not implemented.");
    }

    public get NAME() {
        return "PATH";
    }
}