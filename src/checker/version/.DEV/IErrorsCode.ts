export interface IErrorsCode {
    errors: IErrorCode[];
}

export interface IErrorCode {
    name: string;
    version: string;
    regex: string;
}