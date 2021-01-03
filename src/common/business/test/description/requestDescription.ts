
export interface IRequestDescription {
    url: string;
    method: string;
    headers: { [key: string]: string};
    body: string;
}