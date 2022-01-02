export interface CursorOptions {
    readonly limit?: number;
    readonly sort?: {
        readonly field?: string;
        readonly ascending?: boolean;
    };
    readonly next?: string;
    readonly previous?: string;
}
