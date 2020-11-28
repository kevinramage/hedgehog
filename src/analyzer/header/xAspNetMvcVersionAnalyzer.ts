import { DataManager } from "../../common/business/session/dataManager";
import { Technology } from "../../common/business/session/technology";
import { Context } from "../../common/business/request/context";
import { HEADER_NAME } from "../../common/business/request/header";
import { Session } from "../../common/business/session/session";
import { Warning, WARNING_NAME, WARNING_SEVERITY, WARNING_TYPE } from "../../common/business/session/warning";
import { IAnalyzer } from "../IAnalyzer";

/**
 * Check the presence of XAspNetMvcVersion header
 * If the header is present, add technology and warning
 */
export class XAspNetMvcVersionAnalyzer implements IAnalyzer {

    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        if (context && context.response) {
            const serverHeader = context.response.getHeader(HEADER_NAME.XASPNETMVCVERSION);
            if (serverHeader && serverHeader.value) {
                const serverValue = serverHeader.value as string;
                if (serverValue && serverValue.trim() !== "") {
                    const regex = /[0-9]+\.[0-9]+/g;
                    const warningType = (serverValue.match(regex)) ? WARNING_TYPE.PRODUCTVERSION_INFOS_DIVULGATION : WARNING_TYPE.PRODUCT_INFOS_DIVULGATION;
                    const warningSeverity = (serverValue.match(regex)) ? WARNING_SEVERITY.MAJOR : WARNING_SEVERITY.MINOR;
                    const warning = new Warning(warningType, WARNING_NAME.XASPNETMVCVERSION_HEADER, warningSeverity, serverValue);
                    warning.request = context.request;
                    warning.response = context.response;
                    Session.instance.addWarning(warning);
                    DataManager.instance.addWarning(warning);

                    // Technology
                    const technology = new Technology("asp.net MVC", serverValue);
                    DataManager.instance.addTechnology(technology);
                }
            }
        }
    }

    public get NAME() {
        return "X-ASPNETMVC-VERSION";
    }
}