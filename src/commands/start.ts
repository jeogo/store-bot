import { Context } from 'grammy';
import User from '../models/User';

// Start command handler
export const startCommand = async (ctx: Context) => {
  const telegramId = ctx.from?.id;
  const username = ctx.from?.username || 'unknown';

  if (!telegramId) {
    return ctx.reply('Error: Unable to identify user.');
  }

  // Find or create user in MongoDB
  let user = await User.findOne({ telegramId });
  if (!user) {
    const uniqueId = `USER-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    user = await User.create({
      telegramId,
      uniqueId,
      username,
    });
  }

  ctx.reply(
    `👋 Welcome to the Store Bot! Your balance is ${user.balance} points.`,
    { reply_markup: { keyboard: [['📊 Check Balance', '🛒 Browse Products']], resize_keyboard: true } }
  );
};
