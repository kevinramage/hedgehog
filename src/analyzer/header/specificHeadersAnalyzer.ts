import { Context } from "../../common/business/request/context";
import { IAnalyzer } from "../IAnalyzer";

/**
 * Analyze headers present in response, identify non commun headers
 * Add a mecanism to ignore some custom headers (from config JSON file)
 */
export class SpecificHeadersAnalyzer implements IAnalyzer {
    
    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        throw new Error("Method not implemented.");
    }

    public get NAME() {
        return "SPECIFIC_HEADERS"
    }
}