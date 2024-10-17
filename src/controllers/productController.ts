// controllers/productController.ts

import { Request, Response } from "express";
import mongoose from "mongoose";
import Product, { IProduct } from "../models/Product";
import Category from "../models/Category";

// Get all products
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products: IProduct[] = await Product.find().populate(
      "categoryId",
      "name"
    );
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Create a new product
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, cost, emails, password, categoryId } = req.body;

  // Validate categoryId
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    res.status(400).json({ message: "Invalid category ID format" });
    return;
  }

  // Check if category exists
  const categoryExists = await Category.exists({ _id: categoryId });
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
      categoryId,
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product" });
  }
};

// Update product by MongoDB _id
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, cost, emails, password, categoryId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid product ID format" });
    return;
  }

  // Validate categoryId
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    res.status(400).json({ message: "Invalid category ID format" });
    return;
  }

  // Check if category exists
  const categoryExists = await Category.exists({ _id: categoryId });
  if (!categoryExists) {
    res.status(404).json({ message: "Category not found" });
    return;
  }

  try {
    const emailArray: string[] = Array.isArray(emails)
      ? emails
      : typeof emails === "string"
      ? emails.split("\n").map((email: string) => email.trim())
      : [];

    // Update the product with new data
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        cost,
        emails: emailArray,
        password,
        categoryId,
      },
      { new: true }
    ).populate("categoryId", "name");

    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res
      .status(200)
      .json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
};

// Delete product by MongoDB _id
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid product ID format" });
    return;
  }

  try {
    const product: IProduct | null = await Product.findByIdAndDelete(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
};
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid product ID format" });
    return;
  }

  try {
    const product = await Product.findById(id).populate("categoryId", "name");
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
};
