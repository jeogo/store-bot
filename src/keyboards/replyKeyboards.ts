import { Keyboard } from "grammy";

// Create a reply keyboard with "Check Balance", "My Account Info", and "Browse Products"
export const mainMenuKeyboard = new Keyboard()
  .text("📊 Check Balance").row()
  .text("👤 My Account Info").row()    // "My Account Info" button
  .text("🛒 Browse Products").row();
