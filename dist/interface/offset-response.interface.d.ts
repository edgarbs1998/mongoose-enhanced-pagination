export interface OffsetResponse<T> {
    readonly data: [T];
    readonly paging?: {
        readonly limit: number;
    };
}
