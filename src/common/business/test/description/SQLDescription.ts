import { ITestDescription } from "./testDescription";

export interface ISQLDescription extends ITestDescription {
    delta ?: number;
    referencePayload ?: string;
}