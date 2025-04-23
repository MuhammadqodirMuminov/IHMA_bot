import { Context } from 'grammy';

export const autoDelete = async (ctx: Context, text: string, delay = 10) => {
	const msg = await ctx.reply(text);
	setTimeout(() => {
		if (ctx.chat) {
			ctx.api.deleteMessage(ctx.chat.id, msg.message_id);
		}
	}, delay * 500);
};
