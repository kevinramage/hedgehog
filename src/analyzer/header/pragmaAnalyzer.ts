import { Context } from "../../common/business/context";
import { IAnalyzer } from "../IAnalyzer";

/**
 * ///TODO
 */
export class PragmaAnalyzer implements IAnalyzer {
    
    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        throw new Error("Method not implemented.");
    }

    public get NAME() {
        return "PRAGMA";
    }
}