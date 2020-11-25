import { Context } from "../../common/business/context";
import { IAnalyzer } from "../IAnalyzer";

/**
 * Analyze expect CT header
 * // https://www.ryadel.com/en/expect-ct-http-header-security-chrome/
 */
export class ExpectCTAnalyzer implements IAnalyzer {

    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        throw new Error("Method not implemented.");
    }

    public get NAME() {
        return "EXPECT_CT";
    }
}