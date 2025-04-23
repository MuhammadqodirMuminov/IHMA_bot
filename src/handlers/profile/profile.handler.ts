import { MyContext } from '../../middlewares/session';
import userService from '../../services/user.service';

export const profileHandler = async (ctx: MyContext) => {
	const flow = ctx.session.currentFlow;
	const chatId = ctx.chatId;
	ctx.session.currentFlow = 'profile';
	if (flow === 'main') {
		const user = await userService.findByTelegramId(chatId!);

		await ctx.reply(
			ctx.t('sessionSummary', {
				fullName: user?.fullName || '',
				phone: user?.phone || '',
				district: user?.district || '',
				neighborhood: user?.address || '',
			}),
			{
				reply_markup: {
					keyboard: [[{ text: ctx.t('yes') }, { text: ctx.t('no') }]],
					resize_keyboard: true,
					one_time_keyboard: true,
				},
				parse_mode: 'Markdown',
			},
		);
		return await ctx.reply(ctx.t('registerComplete'));
	}
};
