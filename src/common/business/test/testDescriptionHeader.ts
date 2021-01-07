import { ISQLDescription } from "./description/SQLDescription";

export interface ITestDescriptionHeader {
    name : string;
    goal ?: string;
    description ?: string;
    tags : string[];
    test : ISQLDescription;
}