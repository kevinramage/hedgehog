import { ITestDescription } from "./testDescription";

export interface ICertificateDescription extends ITestDescription {
    host: string;
    port: number;
}