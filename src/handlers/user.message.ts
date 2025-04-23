import { Context } from 'grammy';
import Message from '../models/message.model';
import User from '../models/user.model';

export const handleUserMessages = async (ctx: Context) => {
	const chatId = ctx.chat?.id.toString();
	const text = ctx.message?.text;

	if (!text) return;

	let user = await User.findOne({ chatId });
	if (!user) {
		user = await User.create({ chatId, role: 'fukaro' });
	}

	const message = await Message.create({ user: user._id, content: text });

	const adminGroupId = process.env.ADMIN_GROUP_ID!;
	await ctx.api.sendMessage(
		adminGroupId,
		`📩 New message from ${user.fullName || 'Unknown'}:\n\n${text}`,
		{
			reply_markup: {
				inline_keyboard: [
					[{ text: 'Reply', callback_data: `reply_${message._id}` }],
				],
			},
		},
	);

	await ctx.reply('Your message has been sent to the admins. Thank you!');
};
