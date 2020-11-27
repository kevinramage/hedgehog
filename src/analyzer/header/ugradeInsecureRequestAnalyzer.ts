import { Context } from "../../common/business/request/context";
import { IAnalyzer } from "../IAnalyzer";

/**
 * Check the presence of the upgrade insecure request, if this header is not present add warning
 */
export class UpgradeInsecureRequestAnalyzer implements IAnalyzer {

    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        throw new Error("Method not implemented.");
    }

    public get NAME(){
        return "UPGRADE_INSECURE_REQUEST";
    }
}