import { DataManager } from "../../common/business/session/dataManager";
import { Technology } from "../../common/business/session/technology";
import { Context } from "../../common/business/request/context";
import { HEADER_NAME } from "../../common/business/request/header";
import { Session } from "../../common/business/session/session";
import { Warning, WARNING_NAME, WARNING_SEVERITY, WARNING_TYPE } from "../../common/business/session/warning";
import { IAnalyzer } from "../IAnalyzer";
import { VersionUtils } from "../../common/utils/versionUtils";

/**
 * Analyze XPoweredBy header in reponse
 * If header is present, add technology and warning
 */
export class XPoweredByAnalyzer implements IAnalyzer {

    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        if (context && context.response) {
            const serverHeader = context.response.getHeader(HEADER_NAME.XPOWEREDBY);
            if (serverHeader && serverHeader.value) {
                const serverValue = serverHeader.value as string;
                if (serverValue && serverValue.trim() !== "") {

                    // Detect product version
                    const productVersion = VersionUtils.detectVersion(serverValue.trim());

                    // Add warning
                    const warningType = (productVersion.version !== "") ? WARNING_TYPE.PRODUCTVERSION_INFOS_DIVULGATION : WARNING_TYPE.PRODUCT_INFOS_DIVULGATION;
                    const warningSeverity = (productVersion.version !== "") ? WARNING_SEVERITY.MAJOR : WARNING_SEVERITY.MINOR;
                    const warning = new Warning(warningType, WARNING_NAME.XPOWEREDBY_HEADER, warningSeverity, serverValue);
                    warning.request = context.request;
                    warning.response = context.response;
                    Session.instance.addWarning(warning);
                    DataManager.instance.addWarning(warning);

                    // Add technology
                    const technology = new Technology(productVersion.product, productVersion.version);
                    DataManager.instance.addTechnology(technology);
                }
            }
        }
    }

    public get NAME() {
        return "X-POWERED-BY";
    }
}