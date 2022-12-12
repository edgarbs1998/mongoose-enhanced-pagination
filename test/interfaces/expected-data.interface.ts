export interface ExpectedData<T> {
  readonly data: Array<T>;
  readonly limit: number;
  readonly cursors?: {
    readonly next?: string;
    readonly previous?: string;
  };
}
