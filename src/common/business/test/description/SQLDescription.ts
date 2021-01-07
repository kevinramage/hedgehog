import { ITestDescription } from "../testDescription";
import { IRequestDescription } from "./requestDescription";

export interface ISQLDescription extends ITestDescription {
    request: IRequestDescription;
    delta ?: number;
    referencePayload ?: string;
}