// models/User.ts

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  telegramId: number;
  uniqueId: string;
  username: string;
  balance: number;
}

const UserSchema: Schema<IUser> = new Schema({
  telegramId: { type: Number, required: true, unique: true },
  uniqueId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  balance: { type: Number, default: 0 },
});

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
