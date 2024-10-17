import { InlineKeyboard } from "grammy";
import  Product from "../models/Product"; // Import the Product model correctly

// Create an inline keyboard for browsing products
export const getProductMenuKeyboard = async (): Promise<InlineKeyboard> => {
  const keyboard = new InlineKeyboard();

  try {
    const products = await Product.find(); // Fetch products from MongoDB

    if (products.length === 0) {
      return keyboard.text("No products available").row(); // Handle empty product list
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
    console.error("Error fetching products:", error);
    keyboard.text("Error loading products").row(); // Handle errors in fetching products
  }

  return keyboard;
};
