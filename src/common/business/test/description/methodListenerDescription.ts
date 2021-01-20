import { ITestDescription } from "./testDescription";

export interface IMethodListenerListenerDescription extends ITestDescription {
    host: string;
    port: number;
    path: string;
    ssl: boolean;
}