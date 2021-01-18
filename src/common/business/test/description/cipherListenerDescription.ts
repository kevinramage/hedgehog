import { ITestDescription } from "./testDescription";

export interface ICipherListenerDescription extends ITestDescription {
    host: string;
    port: number;
    path: string;
}