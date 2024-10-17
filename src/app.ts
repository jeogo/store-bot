import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db";
import apiRoutes from "./routes/api";
import { startBot } from "./bot"; // Import the bot
import bodyParser from "body-parser";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Increase the body size limit to 10mb (adjust size as needed)
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS (optional, depending on your frontend setup)

// Use API routes for Express server
app.use("/api", apiRoutes);

// Define a function to start both the server and the bot
const startApp = async () => {
  // Start the Telegram bot
  startBot(); // Starts the bot

  // Start the Express server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Run both the bot and the server
startApp();
