import { InlineKeyboard } from 'grammy';
import { InlineKeyboardButton } from 'grammy/types';
import { MyContext } from '../../middlewares/session';
import userPreferancesService from '../../services/user-preferances.service';
import userService from '../../services/user.service';

export const problemhandler = async (ctx: MyContext) => {
	const flow = ctx.session.currentFlow;
	const chatId = ctx.chatId;

	if (flow === 'main' || flow === 'language') {
		ctx.session.problemStep = 'preferances';
		ctx.session.currentFlow = 'report';

		const user = await userService.findByTelegramId(chatId!);

		const userPreferances = await userPreferancesService.getOrCreate(String(user?._id));

		const inlineKeyboard: InlineKeyboardButton[][] = [
			[
				{
					text: `${user?.fullName} ${userPreferances.name ? '✅' : '❌'}`,
					callback_data: `edit:name:${user?._id}`,
				},
			],
			[
				{
					text: `${user?.phone} ${userPreferances.phone ? '✅' : '❌'}`,
					callback_data: `edit:phone:${user?._id}`,
				},
			],
			[
				{
					text: `${user?.address} ${userPreferances.address ? '✅' : '❌'}`,
					callback_data: `edit:address:${user?._id}`,
				},
			],
			[
				{
					text: ctx.t('confirmSettingsBtn'),
					callback_data: `confirmSettingsBtn`,
				},
			],
		];

		return await ctx.reply(ctx.t('askAnonim'), {
			reply_markup: {
				inline_keyboard: new InlineKeyboard(inlineKeyboard).inline_keyboard,
				remove_keyboard: true,
			},
		});
	}
};
