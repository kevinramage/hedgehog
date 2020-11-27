import { Request } from "../common/business/request/request";
import { Response } from "../common/business/request/response";

export class Warning {
    private _type: string;
    private _name: string;
    private _severity: string;
    private _details: string;
    private _request : Request | undefined;
    private _response : Response | undefined;

    constructor(type: string, name: string, severity: string, details: string) {
        this._type = type;
        this._name = name;
        this._severity = severity;
        this._details = details;
    }

    public static exists(warning: Warning, warnings: Warning[]) {
        return warnings.find(t => { return t.name === warning.name; }) !== undefined;
    }

    public static load(content: string) {
        const warnings : Warning[] = [];
        try {
            const data = JSON.parse(content) as any[];
            data.forEach(w => {
                warnings.push(new Warning(w.type, w.name, w.severity, w.details));
            });
        } catch (ex) {
            /// TODO Handling error
        }

        return warnings;
    }

    public static save(warnings: Warning[]) {
        const warningsFormatted = warnings.map(w => { return {
            type: w._type,
            name: w._name,
            severity: w._severity,
            details: w._details
        }});
        return JSON.stringify(warningsFormatted);
    }

    public get type() {
        return this._type;
    }

    public get name() {
        return this._name;
    }

    public get severity() {
        return this._severity;
    }

    public get details() {
        return this._details;
    }

    public get request() {
        return this._request;
    }

    public set request(value) {
        this._request = value;
    }

    public get response() {
        return this._response;
    }

    public set response(value) {
        this._response = value;
    }
}

export enum WARNING_TYPE {
    PRODUCT_INFOS_DIVULGATION = "Product informations divulgation",
    PRODUCTVERSION_INFOS_DIVULGATION = "Product version informations divulgation",
    WEAK_ACCESSCONTROL = "Weak access control",
    DATA_EXPOSURE = "Data exposure"
}

export enum WARNING_NAME {

    // Header
    SERVER_HEADER = "Server header",
    XASPNETVERSION_HEADER = "X-AspNet-Version",
    XASPNETMVCVERSION_HEADER = "X-AspNetMvc-Version header",
    XPOWEREDBY_HEADER = "X-Powered-By header",
    XXSSPROTECTION_HEADER = "X-XSS-Protection header",
    ACCESSCONTROLALLOWORIGIN_HEADER = "Access-Control-Allow-Origin header",
    CACHECONTROL_HEADER = "Cache-Control header",
    ETAG_HEADER = "ETag header",
    FEATUREPOLICY_HEADER = "Feature-Policy header",

    // Connection
    HTTP_VERSION = "Http version"
}

export enum WARNING_SEVERITY {
    CRITICAL = "CRITICAL",  // Risk of data alteration or server impact
    SEVERE = "SEVERE",      // Sensible informations divulged
    MAJOR = "MAJOR",        // Product infos divulged, invalid configurations
    MINOR = "MINOR",
    WARNING = "WARNING",    // In general a configuration possible but can't be risky in some situations
}