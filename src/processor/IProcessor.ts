import { Context } from "../common/business/context";

export interface IProcessor {
    NAME: string;

    process(context: Context) : Promise<void>;
}