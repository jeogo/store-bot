// routes/index.ts

import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser, // Ensure this is imported
  updateUserBalance,
  deleteUser,
} from "../controllers/userController";
import {
  getProducts,
  createProduct,
  getProductById, // Ensure this is imported
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import {
  getCategories,
  createCategory,
  getCategoryById, // Ensure this is imported
  updateCategory, // Ensure this is imported
  deleteCategory,
  getProductsByCategory,
  addProductToCategory,
} from "../controllers/categoryController";

const router = Router();

// --------------- USER ROUTES ---------------

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.put("/users/:id/balance", updateUserBalance);
router.delete("/users/:id", deleteUser);

// --------------- PRODUCT ROUTES ---------------

router.get("/products", getProducts);
router.post("/products", createProduct);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// --------------- CATEGORY ROUTES ---------------

router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.get("/categories/:id", getCategoryById);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);
router.get("/categories/:id/products", getProductsByCategory);
router.post("/categories/:id/products", addProductToCategory);

export default router;
