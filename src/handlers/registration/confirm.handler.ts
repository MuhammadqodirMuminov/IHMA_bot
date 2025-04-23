import { MyContext } from '../../middlewares/session';
import userService from '../../services/user.service';
import { UserRoles } from '../../types/enum';

export const confirmUserHandler = async (ctx: MyContext) => {
	const step = ctx.session.step;
	const flow = ctx.session.currentFlow;
	const chatId = ctx.chatId;

	if (flow === 'registration') {
		if (step === 'confirm') {
			const userSession = ctx.session.user;

			await userService.createOrUpdate({
				chatId: chatId!,
				fullName: userSession.fullName,
				phone: userSession.phone,
				role: UserRoles.CITIZEN,
				address: userSession.address,
				district: userSession.district,
			});

			ctx.session.currentFlow = 'main';
			ctx.session.step = null;
			ctx.session.user = {};

			return await ctx.reply(ctx.t('confirmedUser'), {
				reply_markup: {
					keyboard: [
						[{ text: ctx.t('offerBtn') }, { text: ctx.t('problemBtn') }],
						[{ text: ctx.t('profileBtn') }],
					],
					resize_keyboard: true,
					one_time_keyboard: true,
				},
			});
		}
	} else if (flow === 'profile' || step === 'idle') {
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
	}
};
