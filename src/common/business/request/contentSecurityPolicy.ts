import { defaultCipherList } from "constants";
import { child } from "winston";

/**
 * Content security policy object
 * RFC 7762
 */
export class ContentSecurityPolicy {

    // child-src <source> <source>;
    public childSrc : string;
    public connectSrc : string;
    public defaultSrc : string;
    public fontSrc : string;
    public frameSrc : string;
    public imgSrc : string;
    public manifestSrc : string;
    public mediaSrc : string;
    public objectSrc : string;
    public prefetchSrc : string;
    public scriptSrc : string;
    public scriptSrcElem : string;
    public scriptSrcAttr : string;
    public styleSrc : string;
    public styleSrcElem : string;
    public styleSrcAttr : string;
    public workerSrc : string;
    public baseUri : string;
    public pluginTypes : string;
    public sandBox : string;
    public formAction : string;
    public frameAncestors : string;
    public navigateTo : string;
    public reportUri : string;
    public reportTo : string;
    public blockAllMixedContent : string;
    public referrer : string;
    public requireSriFor  : string;
    public trustedTypes : string;
    public upgradeInsecureRequests : string;

    constructor() {

        // Fetch
        this.childSrc = "";
        this.connectSrc = "";
        this.defaultSrc = "";
        this.fontSrc = "";
        this.frameSrc = "";
        this.imgSrc = "";
        this.manifestSrc = "";
        this.mediaSrc = "";
        this.objectSrc = "";
        this.prefetchSrc = "";
        this.scriptSrc = "";
        this.scriptSrcElem = "";
        this.scriptSrcAttr = "";
        this.styleSrc = "";
        this.styleSrcElem = "";
        this.styleSrcAttr = "";
        this.workerSrc = "";

        // Document directive
        this.baseUri = "";
        this.pluginTypes = "";
        this.sandBox = "";

        // Navigation directive
        this.formAction = "";
        this.frameAncestors = "";
        this.navigateTo = "";

        // Report directive
        this.reportUri = "";
        this.reportTo = "";

        // Others directives
        this.blockAllMixedContent = "";
        this.referrer = "";
        this.requireSriFor = "";
        this.trustedTypes = "";
        this.upgradeInsecureRequests = "";
    }
}