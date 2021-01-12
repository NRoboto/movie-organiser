import { User } from "./model";
import { UserDocument } from "./types";

export type { UserDocument, UserModel } from "./types";
export { userSchema } from "./schema";
export { User } from "./model";

export const isUser = (user: any): user is UserDocument =>
  user && user.schema === User.schema;
