import { Context } from "../common/business/context";

export interface IAnalyzer {
    NAME: string;
    analyze(context: Context) : void;
}