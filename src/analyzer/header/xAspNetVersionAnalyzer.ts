import { DataManager } from "../../result/dataManager";
import { Technology } from "../../result/technology";
import { Context } from "../../common/business/context";
import { HEADER_NAME } from "../../common/business/header";
import { Session } from "../../result/session";
import { Warning, WARNING_NAME, WARNING_SEVERITY, WARNING_TYPE } from "../../result/warning";
import { IAnalyzer } from "../IAnalyzer";

/**
 * Analyze the XAspNetVersion header in response
 * If the header is present, add technology and add warning
 */
export class XAspNetVersionAnalyzer implements IAnalyzer {

    /**
     * Analyze response source code
     * @param context query context
     */
    public analyze(context: Context): void {
        if ( context && context.response ) {
            const serverHeader = context.response.getHeader(HEADER_NAME.XASPNETVERSION);
            if ( serverHeader && serverHeader.value ) {
                const serverValue = serverHeader.value as string;
                if ( serverValue && serverValue.trim() != "") {
                    const regex = /[0-9]+\.[0-9]+/g;
                    var warning;
                    if ( serverValue.match(regex) ) {
                        warning = new Warning(WARNING_TYPE.PRODUCTVERSION_INFOS_DIVULGATION, WARNING_NAME.XASPNETVERSION_HEADER, WARNING_SEVERITY.MAJOR, serverValue);
                    } else {
                        warning = new Warning(WARNING_TYPE.PRODUCT_INFOS_DIVULGATION, WARNING_NAME.XASPNETVERSION_HEADER, WARNING_SEVERITY.MINOR, serverValue);
                    }
                    warning.request = context.request;
                    warning.response = context.response;
                    Session.instance.addWarning(warning);
                    DataManager.instance.addWarning(warning);

                    // Technology
                    const technology = new Technology("asp.net", serverValue);
                    DataManager.instance.addTechnology(technology);
                }
            } 
        }
    }
    
    public get NAME() {
        return "X-ASPNET-VERSION";
    }
}