import { InlineKeyboard } from "grammy";
import Category from "../models/Category";

// Create an inline keyboard to display categories
export const getCategoryKeyboard = async (): Promise<InlineKeyboard> => {
  const keyboard = new InlineKeyboard();
  const categories = await Category.find(); // Fetch categories from MongoDB

  categories.forEach((category) => {
    keyboard.text(category.name, `category:${category.id}`).row(); // Each button corresponds to a category
  });

  return keyboard;
};
