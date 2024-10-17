import { Bot } from "grammy";
import dotenv from "dotenv";
import connectDB from "./db";
import User from "./models/User";
import { getCategoryKeyboard } from "./keyboards/categoryKeyboard";
import { getProductKeyboard } from "./keyboards/productKeyboard";
import { confirmationKeyboard } from "./keyboards/confirmationKeyboards";
import Product from "./models/Product"; // Corrected import
import { mainMenuKeyboard } from "./keyboards/replyKeyboards";
import { escapeMarkdownV2 } from "./utils/escapeMarkdownV2";

dotenv.config();

export const startBot = async () => {
  // Connect to MongoDB (Ensure this is done before starting the bot)
  await connectDB();

  // Initialize the bot
  const bot = new Bot(process.env.BOT_TOKEN as string);

  // Bot Command: /start
  bot.command("start", async (ctx) => {
    const userId = ctx.from?.id;
    const username = ctx.from?.username || "unknown";

    if (!userId) {
      return await ctx.reply("Error: Unable to identify user.");
    }

    // Find or create a user in MongoDB
    let user = await User.findOne({ telegramId: userId });
    if (!user) {
      const uniqueId = `USER-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`;
      user = await User.create({
        telegramId: userId,
        uniqueId,
        username,
        balance: 500, // Default balance
      });
    }

    // Send the welcome message with the main menu keyboard
    await ctx.reply(
      `👋 Welcome to the Store Bot! Your balance is ${user.balance} points.\nUse the menu below to choose an option:`,
      {
        reply_markup: {
          keyboard: mainMenuKeyboard.build(),
          resize_keyboard: true,
        },
      }
    );
  });

  // Handle button clicks from the reply keyboard
  bot.on("message:text", async (ctx) => {
    const userId = ctx.from?.id;

    if (!userId) {
      return await ctx.reply("Error: Unable to identify user.");
    }

    const user = await User.findOne({ telegramId: userId });
    if (!user) return;

    const text = ctx.message?.text;

    // Handle "Check Balance" button
    if (text === "📊 Check Balance") {
      await ctx.reply(`💰 Your balance is ${user.balance} points.`);
    }

    // Handle "My Account Info" button
    if (text === "👤 My Account Info") {
      await ctx.reply(
        `👤 *Account Information:*\n\n• *ID*: \`${user.telegramId}\`\n• *Unique ID*: \`${user.uniqueId}\`\n• *Username*: @${user.username}\n• *Balance*: \`${user.balance} points\``,
        { parse_mode: "MarkdownV2" }
      );
    }

    // Handle "Browse Products" button (show categories first)
    if (text === "🛒 Browse Products") {
      const categoryKeyboard = await getCategoryKeyboard(); // Generate inline keyboard for categories
      await ctx.reply("📂 Select a category:", {
        reply_markup: categoryKeyboard,
      });
    }
  });

  // Handle category and product selections
  bot.on("callback_query:data", async (ctx) => {
    const data = ctx.callbackQuery?.data;
    const userId = ctx.from?.id;

    if (!userId) {
      return await ctx.reply("Error: Unable to identify user.");
    }

    const user = await User.findOne({ telegramId: userId });
    if (!user) return;

    try {
      // Handle category selection
      if (data?.startsWith("category")) {
        const categoryId = data.split(":")[1]; // Extract categoryId as a string
        const productKeyboard = await getProductKeyboard(categoryId); // Generate product keyboard for the selected category
        await ctx.reply("🛒 Select a product:", {
          reply_markup: productKeyboard,
        });
      }

      if (data?.startsWith("buy_product")) {
        const productId = data.split(":")[1];
        const product = await Product.findById(productId);
      
        if (product && product.emails.length > 0) {
          // Escape product name and cost for MarkdownV2
          const escapedProductName = escapeMarkdownV2(product.name);
          const escapedProductCost = escapeMarkdownV2(product.cost.toString());
      
          await ctx.reply(
            `🛒 You are about to purchase <b>${product.name}</b> for <b>${product.cost} points</b>.\nDo you confirm this purchase?`,
            {
              reply_markup: confirmationKeyboard(productId),
              parse_mode: "HTML",
            }
        
          
          );
        } else {
          await ctx.reply("❌ This product is no longer available.");
        }
      }
      

      // Handle purchase confirmation
      if (data?.startsWith("confirm")) {
        const productId = data.split(":")[1];
        const product = await Product.findById(productId);
      
        if (product && product.emails.length > 0) {
          if (user.balance >= product.cost) {
            // Deduct points and give product
            user.balance -= product.cost;
            const email = product.emails.shift(); // Get and remove the first available email
            const password = product.password;
      
            // Check if email is available, otherwise send error
            if (!email) {
              await ctx.reply("❌ No email available for this product.");
              return;
            }
      
            // Save the updated user and product information in the database
            await user.save(); // Update user in the database
            await product.save(); // Update product (reduce quantity) in the database
      
            // Send purchase confirmation with account details in HTML mode
            await ctx.reply(
              `✅ <b>Purchase Confirmed!</b>\n\nYou have successfully bought <b>${product.name}</b>.\nHere are your account details:\n\n• <b>Email</b>: <code>${email}</code>\n• <b>Password</b>: <code>${password || "N/A"}</code>\n\nEnjoy your account!`,
              { parse_mode: "HTML" }
            );
          } else {
            await ctx.reply("❌ You do not have enough points for this purchase.");
          }
        } else {
          await ctx.reply("❌ This product is no longer available.");
        }
      }
      

      // Handle purchase cancellation
      if (data?.startsWith("cancel")) {
        await ctx.reply("❌ Purchase canceled.");
      }

      await ctx.answerCallbackQuery(); // Acknowledge the callback query
    } catch (error) {
      console.error("Error handling callback query:", error);
      await ctx.reply("❌ An error occurred. Please try again later.");
    }
  });

  // Start the bot
  bot.start();
  console.log("Telegram bot started!");
};
