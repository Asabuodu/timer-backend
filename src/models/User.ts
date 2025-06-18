

import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Avoid model overwrite in dev
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

export type UserType = {
  _id: string;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};
