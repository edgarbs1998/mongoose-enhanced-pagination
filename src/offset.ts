import { Document, Model, Query } from "mongoose";

import { PaginationQueryHelpers, OffsetOptions } from ".";

export function offsetPaginate<T>(
  this: Model<T, PaginationQueryHelpers<T>>,
  options: OffsetOptions
): Query<any, Document<T>> & PaginationQueryHelpers<T> {
  console.dir(options);
  throw new Error("Not yet implemented");
}
