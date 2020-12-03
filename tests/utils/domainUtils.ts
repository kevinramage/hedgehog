
import * as assert from "assert";
import { DomainUtils } from "../../src/common/utils/domainUtils";

describe("Domain Utils", () => {
    describe("isIncludedInCommonName", () => {

        assert.strictEqual(DomainUtils.isIncludedInCommonName("www.mydomain.com", "www.mydomain.com"), true, "simple case");
        assert.strictEqual(DomainUtils.isIncludedInCommonName("www.mydomain.com", "mydomain.com"), true, "sub domain case");
        assert.strictEqual(DomainUtils.isIncludedInCommonName("www.sub.mydomain.com", "mydomain.com"), true, "sub sub domain case");
        assert.strictEqual(DomainUtils.isIncludedInCommonName("www.sub1.sub2.mydomain.com", "mydomain.com"), true, "sub sub sub domain case");
        assert.strictEqual(DomainUtils.isIncludedInCommonName("*.mydomain.com", "mydomain.com"), true, "wildcard case");
        assert.strictEqual(DomainUtils.isIncludedInCommonName("*.mydomain.com", "www.mydomain.com"), true, "wildcard case sub domain");
        assert.strictEqual(DomainUtils.isIncludedInCommonName("*.mydomain.com", "www.sub.mydomain.com"), true, "wildcard case sub sub domain");

        assert.strictEqual(DomainUtils.isIncludedInCommonName("www.mydomain2.com", "www.mydomain.com"), false, "simple case KO");
        assert.strictEqual(DomainUtils.isIncludedInCommonName("www.mydomain", "www.mydomain.com"), false, "simple case KO 2");
        assert.strictEqual(DomainUtils.isIncludedInCommonName("www.mydomaincom", "mydomain.com"), false, "sub domain case KO");
        assert.strictEqual(DomainUtils.isIncludedInCommonName("www.sub.mydomain.com", "www.mydomain.com"), false, "sub sub domain case KO");
        assert.strictEqual(DomainUtils.isIncludedInCommonName("*.mydomain.com", "mydomain2.com"), false, "wildcard case KO");
    });
});