import { model, Schema } from "mongoose";

import { PaginationModel, mongooseEnhancedPagination } from "../../src";

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

// TODO Test if the commented type is required
export const UserSchema = new Schema<User /*, PaginationModel<User>*/>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
}).plugin(mongooseEnhancedPagination);

export const UserModel = model<User, PaginationModel<User>>("User", UserSchema);
