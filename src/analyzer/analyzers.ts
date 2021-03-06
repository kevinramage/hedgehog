import { Context } from "../common/business/request/context";
import { AntiCSRFAnalyzer } from "./code/antiXSRFTokenAnalyzer";
import { CommentPathAnalyser } from "./code/commentPathAnalyzer";
import { ErrorPageAnalyzer } from "./code/errorPageAnalyzer";
import { HttpVersionAnalyzer } from "./connection/httpVersionAnalyzer";
import { HttpOnlyAnalyzer } from "./cookie/httpOnlyAnalyzer";
import { SecureAnalyzer } from "./cookie/secureAnalyzer";
import { AccessControlAllowOriginAnalyzer } from "./header/accessControlAllowOriginAnalyzer";
import { CacheControlAnalyzer } from "./header/cacheControlAnalyzer";
import { ContentSecurityPolicyAnalyzer } from "./header/contentSecurityPolicyAnalyzer";
import { ETagAnalyzer } from "./header/eTagAnalyzer";
import { ExpectCTAnalyzer } from "./header/expectCTAnalyzer";
import { FeaturePolicyAnalyzer } from "./header/featurePolicyAnalyzer";
import { HPKPAnalyzer } from "./header/hpkpAnalyzer";
import { HSTSAnalyzer } from "./header/hstsAnalyzer";
import { PragmaAnalyzer } from "./header/pragmaAnalyzer";
import { ReferrerPolicyAnalyzer } from "./header/referrerPolicyAnalyzer";
import { ServerHeaderAnalyzer } from "./header/serverHeaderAnalyzer";
import { SpecificHeadersAnalyzer } from "./header/specificHeadersAnalyzer";
import { UpgradeInsecureRequestAnalyzer } from "./header/ugradeInsecureRequestAnalyzer";
import { XAspNetMvcVersionAnalyzer } from "./header/xAspNetMvcVersionAnalyzer";
import { XAspNetVersionAnalyzer } from "./header/xAspNetVersionAnalyzer";
import { XPoweredByAnalyzer } from "./header/xPoweredByAnalyzer";
import { IAnalyzer } from "./IAnalyzer";
import { PathAnalyzer } from "./path/pathAnalyzer";

/**
 * @ignore
 */
import analyzersConfiguration = require("../config/analyzers.json");

/**
 * Class to retrieve all analyzers installed and configured on system
 */
export class Analyzers {
    private static _instance : Analyzers;
    private _analyzers : IAnalyzer[];

    private constructor() {
        this._analyzers = [];

        // Code
        this._analyzers.push(new CommentPathAnalyser());
        this._analyzers.push(new AntiCSRFAnalyzer());
        this._analyzers.push(new ErrorPageAnalyzer());

        // Connection
        this._analyzers.push(new HttpVersionAnalyzer());

        // Cookie
        this._analyzers.push(new HttpOnlyAnalyzer());
        this._analyzers.push(new SecureAnalyzer());

        // Header
        this._analyzers.push(new AccessControlAllowOriginAnalyzer());
        this._analyzers.push(new CacheControlAnalyzer());
        this._analyzers.push(new ContentSecurityPolicyAnalyzer());
        this._analyzers.push(new ETagAnalyzer());
        this._analyzers.push(new ExpectCTAnalyzer());
        this._analyzers.push(new FeaturePolicyAnalyzer());
        this._analyzers.push(new HPKPAnalyzer());
        this._analyzers.push(new HSTSAnalyzer());
        this._analyzers.push(new PragmaAnalyzer());
        this._analyzers.push(new ReferrerPolicyAnalyzer());
        this._analyzers.push(new ServerHeaderAnalyzer());
        this._analyzers.push(new SpecificHeadersAnalyzer());
        this._analyzers.push(new UpgradeInsecureRequestAnalyzer());
        this._analyzers.push(new XAspNetVersionAnalyzer());
        this._analyzers.push(new XAspNetMvcVersionAnalyzer());
        this._analyzers.push(new XPoweredByAnalyzer());

        // Path
        this._analyzers.push(new PathAnalyzer());
    }

    /**
     * Get all analyzers installed and configured (config/analyzers.json)
     * @returns all analyzers available
     */
    public getAll() {
        const analyzersName = analyzersConfiguration as string[];
        return this._analyzers.filter((a) => { return analyzersName.includes(a.NAME); });
    }

    /**
     * Run all analyzers
     * @param context context to analyze
     */
    public run(context: Context) {
        const analyzers = Analyzers.instance.getAll();
        analyzers.forEach((analyzer) => { return analyzer.analyze(context); });
    }

    /**
     * Get unique instance (Singleton)
     * @returns the unique instance of Analyzers
     */
    public static get instance() {
        if (!Analyzers._instance) {
            Analyzers._instance = new Analyzers();
        }
        return Analyzers._instance;
    }
}