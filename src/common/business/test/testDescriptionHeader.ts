import { ISQLOrDescription } from "./description/SQLOrDescription";

export interface ITestDescriptionHeader {
    name : string;
    goal ?: string;
    description ?: string;
    tags : string[];
    test : ISQLOrDescription;
}