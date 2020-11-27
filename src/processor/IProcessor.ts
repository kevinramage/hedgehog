import { Context } from "../common/business/request/context";

export interface IProcessor {
    NAME: string;

    process(context: Context) : Promise<void>;
}