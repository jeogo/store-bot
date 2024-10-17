// models/Product.ts

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  cost: number;
  emails: string[];
  password: string;
  categoryId: mongoose.Types.ObjectId;
}

const ProductSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true },
  emails: [{ type: String, required: true }],
  password: { type: String, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  ProductSchema
);
export default Product;
