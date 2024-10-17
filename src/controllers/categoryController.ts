// controllers/categoryController.ts

import { Request, Response } from "express";
import mongoose from "mongoose";
import Category, { ICategory } from "../models/Category";
import Product, { IProduct } from "../models/Product";

// Get all categories
export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories: ICategory[] = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Create a new category
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

// Delete a category by MongoDB _id
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid category ID format" });
    return;
  }

  try {
    const category: ICategory | null = await Category.findByIdAndDelete(id);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};

// Get all products in a category by categoryId
export const getProductsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid category ID format" });
    return;
  }

  try {
    const products: IProduct[] = await Product.find({ categoryId: id });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Failed to fetch products by category" });
  }
};

// Add a product to a category by MongoDB _id
export const addProductToCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, cost, emails, password } = req.body;

  // Validate categoryId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid category ID format" });
    return;
  }

  // Check if category exists
  const categoryExists = await Category.exists({ _id: id });
  if (!categoryExists) {
    res.status(404).json({ message: "Category not found" });
    return;
  }

  try {
    const emailArray: string[] = Array.isArray(emails)
      ? emails
      : typeof emails === "string"
      ? emails.split(",").map((email: string) => email.trim())
      : [];

    // Hash the password before saving (security best practice)
    // Uncomment the following lines after installing bcrypt
    // import bcrypt from 'bcrypt';
    // const hashedPassword = await bcrypt.hash(password, 10);

    const product = new Product({
      name,
      cost,
      emails: emailArray,
      password, // Replace with hashedPassword after hashing
      categoryId: id,
    });

    await product.save();
    res.status(201).json({ message: "Product added to category", product });
  } catch (error) {
    console.error("Error adding product to category:", error);
    res.status(500).json({ error: "Failed to add product to category" });
  }
};
// Update category by MongoDB _id
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid category ID format' });
    return;
  }

  try {
    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Error updating category' });
  }
};
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid category ID format' });
    return;
  }

  try {
    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Error fetching category' });
  }
};