import { Document, Model, Query } from "mongoose";
import { CursorOptions, PaginationQueryHelpers } from ".";
export declare function cursorPaginate<T>(this: Model<T, PaginationQueryHelpers<T>>, options?: CursorOptions): Query<any, Document<T>> & PaginationQueryHelpers<T>;
