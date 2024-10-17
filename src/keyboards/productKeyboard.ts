import { InlineKeyboard } from "grammy";
import Product from "../models/Product";
import mongoose from "mongoose";

// Create inline keyboard for products in a specific category
export const getProductKeyboard = async (
  categoryId: string // Ensure categoryId is passed as a string (ObjectId)
): Promise<InlineKeyboard> => {
  const keyboard = new InlineKeyboard();

  try {
    // Fetch products for the specific category
    const products = await Product.find({
      categoryId: new mongoose.Types.ObjectId(categoryId),
    });

    if (products.length === 0) {
      return keyboard.text("No products available for this category").row(); // Handle empty product list
    }

    // Loop over the products and create a button for each
    products.forEach((product) => {
      keyboard
        .text(
          `${product.name} - ${product.cost} points`,
          `buy_product:${product._id}`
        )
        .row();
    });
  } catch (error) {
    console.error("Error fetching products for category:", error);
    keyboard.text("Error loading products").row(); // Handle errors
  }

  return keyboard;
};
