import { MyContext } from '../../middlewares/session';

export const rejectUserHandler = async (ctx: MyContext) => {
	const step = ctx.session.step;
	const flow = ctx.session.currentFlow;

	console.log(flow);

	if (flow === 'registration' || flow === 'profile') {
		if (step === 'confirm' || step == 'idle') {
			ctx.session.currentFlow = 'language';
			ctx.session.step = 'idle';
			ctx.session.user = {};

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
	}
};
