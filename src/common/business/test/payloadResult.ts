export interface PayloadResult {
    status: PayloadResultType;
    errorMessage ?: string;
    data ?: number;
    payload : string;
    time : number;
}

export type PayloadResultType = "INJECTED" | "NOT_INJECTED" | "ERROR" | "NOT_DEFINED" | "WARNING";