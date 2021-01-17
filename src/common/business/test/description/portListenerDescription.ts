import { ITestDescription } from "./testDescription";

export interface IPortListenerDescription extends ITestDescription {
    host: string;
    portsToCheck: {
      min: number;
      max: number;
    }
    validPorts: number[];
}