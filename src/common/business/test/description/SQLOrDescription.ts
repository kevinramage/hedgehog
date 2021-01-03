import { ITestDescription } from "../testDescription";
import { IRequestDescription } from "./requestDescription";

export interface ISQLOrDescription extends ITestDescription {
    request: IRequestDescription;
    delta ?: number;
    referencePayload ?: string;
}