import { Context } from "../common/business/request/context";

export interface IAnalyzer {
    NAME: string;
    analyze(context: Context) : void;
}