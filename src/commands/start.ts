import { MyContext } from '../middlewares/session';
import userService from '../services/user.service';

export const startCommand = async (ctx: MyContext) => {
	const chatId = ctx.chatId;

	const user = await userService.findByTelegramId(chatId!);

	if (user) {
		ctx.session.currentFlow = 'main';
		ctx.reply(ctx.t('home'), {
			reply_markup: {
				keyboard: [
					[{ text: ctx.t('offerBtn') }, { text: ctx.t('problemBtn') }],
					[{ text: ctx.t('profileBtn') }],
				],
				resize_keyboard: true,
				one_time_keyboard: true,
			},
		});
	} else {
		await ctx.reply(`Тилни танланг:\nTilni tanlang:\nВыбор языка:`, {
			reply_markup: {
				keyboard: [
					[{ text: "O'zbek tili" }, { text: 'Русский язык' }],
					[{ text: 'Ўзбек тили' }],
				],
				resize_keyboard: true,
				one_time_keyboard: true,
			},
		});
	}
};
