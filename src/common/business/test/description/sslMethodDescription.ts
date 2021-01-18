import { ITestDescription } from "./testDescription";

export interface ISSLMethodDescription extends ITestDescription {
    host: string;
    port: number;
    validSSLMethods: string[];
}