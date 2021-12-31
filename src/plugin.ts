import { Document, Model, Query, Schema } from "mongoose";

import { CursorOptions, OffsetOptions } from ".";
import { cursorPaginate } from "./cursor";
import { offsetPaginate } from "./offset";

export interface PaginationQueryHelpers<T> {
  cursorPaginate(
    option?: CursorOptions
  ): Query<any, Document<T>> & PaginationQueryHelpers<T>;
  offsetPaginate(
    option?: OffsetOptions
  ): Query<any, Document<T>> & PaginationQueryHelpers<T>;
}

export interface PaginationModel<T>
  extends Model<T, PaginationQueryHelpers<T>> {
  cursorPaginate(
    option?: CursorOptions
  ): Query<any, Document<T>> & PaginationQueryHelpers<T>;
  offsetPaginate(
    option?: OffsetOptions
  ): Query<any, Document<T>> & PaginationQueryHelpers<T>;
}

/**
 * The mongoose plugin
 * @param schema mongoose schema
 */
export function mongooseEnhancedPagination(schema: Schema) {
  // Cursor pagination
  schema.static("cursorPaginate", cursorPaginate);
  schema.query["cursorPaginate"] = cursorPaginate;

  // Offset pagination
  schema.static("offsetPaginate", offsetPaginate);
  schema.query["offsetPaginate"] = offsetPaginate;
}
