import { Document, Model, Query, Schema } from "mongoose";
import { CursorOptions, OffsetOptions } from ".";
export interface PaginationQueryHelpers<T> {
    cursorPaginate(option?: CursorOptions): Query<any, Document<T>> & PaginationQueryHelpers<T>;
    offsetPaginate(option?: OffsetOptions): Query<any, Document<T>> & PaginationQueryHelpers<T>;
}
export interface PaginationModel<T> extends Model<T, PaginationQueryHelpers<T>> {
    cursorPaginate(option?: CursorOptions): Query<any, Document<T>> & PaginationQueryHelpers<T>;
    offsetPaginate(option?: OffsetOptions): Query<any, Document<T>> & PaginationQueryHelpers<T>;
}
/**
 * The mongoose plugin
 * @param schema mongoose schema
 */
export declare function mongooseEnhancedPagination(schema: Schema): void;
