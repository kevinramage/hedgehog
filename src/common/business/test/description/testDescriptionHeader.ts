import { ISQLDescription } from "./SQLDescription";

export interface ITestDescriptionHeader {
    name : string;
    goal ?: string;
    description ?: string;
    tags : string[];
    test : ISQLDescription;
}