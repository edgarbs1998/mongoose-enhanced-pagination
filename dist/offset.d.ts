import { Document, Model, Query } from "mongoose";
import { PaginationQueryHelpers, OffsetOptions } from ".";
export declare function offsetPaginate<T>(this: Model<T, PaginationQueryHelpers<T>>, options: OffsetOptions): Query<any, Document<T>> & PaginationQueryHelpers<T>;
