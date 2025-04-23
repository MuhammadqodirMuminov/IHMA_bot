import { Context } from 'grammy';
import Message from '../models/message.model';

export const handleAdminReplies = async (ctx: Context) => {
	if (!ctx.message?.reply_to_message) return;

	const originalText = ctx.message.reply_to_message.text;
	const replyText = ctx.message.text;

	if (!originalText || !replyText) return;

	const messageIdMatch = originalText.match(/reply_(\w+)/);
	if (!messageIdMatch) return;

	const messageId = messageIdMatch[1];
	const message = await Message.findById(messageId).populate('user');

	if (!message || !message.user) return;

	const user = message.user as any;

	await ctx.api.sendMessage(user.chatId, `💬 Admin reply:\n\n${replyText}`);
	message.status = 'reviewed';
	await message.save();
};
