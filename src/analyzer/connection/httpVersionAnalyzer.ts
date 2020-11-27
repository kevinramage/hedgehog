import { Context } from "../../common/business/request/context";
import { DataManager } from "../../result/dataManager";
import { Session } from "../../result/session";
import { Warning, WARNING_NAME, WARNING_SEVERITY, WARNING_TYPE } from "../../result/warning";
import { IAnalyzer } from "../IAnalyzer";

const NONSECURE_HTTPVERSION = require("../../config/connection/nonSecureHttpVersion.json");

/**
 * Check the http version use to exchange data between client and server
 * The http version must be different from "SSLv2, SSLv3, TLSv1, TLSv1_1"
 */
export class HttpVersionAnalyzer implements IAnalyzer {

    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        const nonSecureHttpVersion = NONSECURE_HTTPVERSION as string[];
        if (context && context.request && context.request.httpVersion) {
            const httpVersion = context.request.httpVersion.trim();
            if (nonSecureHttpVersion.includes(httpVersion)) {
                this.addWarning(httpVersion);
            }
        } else {
            this.addWarning("");
        }
    }

    /**
     * Add a warning to session and data manager
     * @param httpVersion unsecure http version
     */
    private addWarning(httpVersion: string) {
        const warning = new Warning(WARNING_TYPE.DATA_EXPOSURE, WARNING_NAME.HTTP_VERSION, WARNING_SEVERITY.SEVERE, httpVersion);
        Session.instance.addWarning(warning);
        DataManager.instance.addWarning(warning);
    }

    public get NAME() {
        return "HTTP_VERSION";
    }
}