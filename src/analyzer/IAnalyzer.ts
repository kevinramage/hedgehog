import { Context } from "../common/business/request/context";

/**
 * Interface to define an analyzer
 */
export interface IAnalyzer {

    /**
     * Analyzer name (Use in configuration file to enable / disable analyzer)
     */
    NAME: string;

    /**
     * Run the analyze of a specific context (request/response)
     * @param context context to analyze
     */
    analyze(context: Context) : void;
}