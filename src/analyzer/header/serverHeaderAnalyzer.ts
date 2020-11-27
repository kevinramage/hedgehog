import { DataManager } from "../../result/dataManager";
import { Technology } from "../../result/technology";
import { Context } from "../../common/business/request/context";
import { HEADER_NAME } from "../../common/business/request/header";
import { Session } from "../../result/session";
import { Warning, WARNING_NAME, WARNING_SEVERITY, WARNING_TYPE } from "../../result/warning";
import { IAnalyzer } from "../IAnalyzer";
import { VersionUtils } from "../../common/utils/versionUtils";

/**
 * Analyze server header in reponse
 * Read header, parse it and detect technology
 * Add warning if this header is present
 */
export class ServerHeaderAnalyzer implements IAnalyzer {

    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        if (context && context.response) {
            const serverHeader = context.response.getHeader(HEADER_NAME.SERVER);
            if (serverHeader && serverHeader.value) {
                const serverValue = serverHeader.value as string;
                if (serverValue && serverValue.trim() !== "") {
                    const productVersion = VersionUtils.detectVersion(serverValue.trim());

                    // Warning
                    let warning;
                    if (productVersion.version !== "") {
                        warning = new Warning(WARNING_TYPE.PRODUCTVERSION_INFOS_DIVULGATION, WARNING_NAME.SERVER_HEADER, WARNING_SEVERITY.MAJOR, serverValue);
                    } else {
                        warning = new Warning(WARNING_TYPE.PRODUCT_INFOS_DIVULGATION, WARNING_NAME.SERVER_HEADER, WARNING_SEVERITY.MINOR, serverValue);
                    }
                    warning.request = context.request;
                    warning.response = context.response;
                    Session.instance.addWarning(warning);
                    DataManager.instance.addWarning(warning);

                    // Technology
                    const technology = new Technology(productVersion.product, productVersion.version);
                    DataManager.instance.addTechnology(technology);
                }
            } 
        }
    }

    public get NAME() {
        return "SERVER";
    }
}