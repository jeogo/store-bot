import { InlineKeyboard } from 'grammy';

// Inline keyboard for confirming or canceling a purchase
export const confirmationKeyboard = (productId: string): InlineKeyboard => {
  return new InlineKeyboard()
    .text('✅ Confirm', `confirm:${productId}`).row()  // Confirm button
    .text('❌ Cancel', `cancel:${productId}`).row();   // Cancel button
};
