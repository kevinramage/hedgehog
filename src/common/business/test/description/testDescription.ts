import { IRequestDescription } from "./requestDescription";

export interface ITestDescription {
    type: TestDescriptionType;
    request: IRequestDescription;
}

export type TestDescriptionType =

    // Injection
    "ELInjection" |
    "LDAPInjection" |
    "NoSQLInjection" |
    "OGNLInjection" |
    "ORMInjection" |
    "OSInjection" |
    "SQLAndInjection" |
    "SQLErrorInjection" |
    "SQLOrInjection" |
    "SQLTimeInjection" |
    "SQLUnionInjection" |

    // Server
    "CertificateChecker" |
    "CipherChecker" |
    "PortListenerChecker" |
    "SSLMethodChecker" |

    // XSS
    "DOMXSS" |
    "ReflectedXSS" |
    "StoredXSS"