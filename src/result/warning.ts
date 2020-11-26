import { Request } from "../common/business/request";
import { Response } from "../common/business/response";

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

export namespace WARNING_TYPE {
    export const PRODUCT_INFOS_DIVULGATION = "Product informations divulgation";
    export const PRODUCTVERSION_INFOS_DIVULGATION = "Product version informations divulgation";
    export const WEAK_ACCESSCONTROL = "Weak access control";
    export const DATA_EXPOSURE = "Data exposure"
}

export namespace WARNING_NAME {

    // Header
    export const SERVER_HEADER = "Server header";
    export const XASPNETVERSION_HEADER = "X-AspNet-Version";
    export const XASPNETMVCVERSION_HEADER = "X-AspNetMvc-Version header";
    export const XPOWEREDBY_HEADER = "X-Powered-By header";
    export const XXSSPROTECTION_HEADER = "X-XSS-Protection header";
    export const ACCESSCONTROLALLOWORIGIN_HEADER = "Access-Control-Allow-Origin header";
    export const CACHECONTROL_HEADER = "Cache-Control header";
    export const ETAG_HEADER = "ETag header";
    export const FEATUREPOLICY_HEADER = "Feature-Policy header";

    // Connection
    export const HTTP_VERSION = "Http version";
}

export namespace WARNING_SEVERITY {
    export const CRITICAL = "CRITICAL"; // Risk of data alteration or server impact
    export const SEVERE = "SEVERE"; // Sensible informations divulged
    export const MAJOR = "MAJOR"; // Product infos divulged, invalid configurations
    export const MINOR = "MINOR";
    export const WARNING = "WARNING"; // In general a configuration possible but can't be risky in some situations
}