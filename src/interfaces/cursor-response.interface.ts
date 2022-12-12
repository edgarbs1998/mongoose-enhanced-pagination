export interface CursorResponse<T> {
  readonly data: T[];
  readonly paging: {
    readonly limit: number;
    readonly cursors?: {
      readonly next?: string;
      readonly previous?: string;
    };
  };
}
