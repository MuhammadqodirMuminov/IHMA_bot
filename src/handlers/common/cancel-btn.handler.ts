import { MyContext } from '../../middlewares/session';

export const cancelHandler = async (ctx: MyContext) => {
	const offerStep = ctx.session.offerStep;
	const flow = ctx.session.currentFlow;
	const reportOffer = ctx.session.problemStep;

	if (flow === 'offer') {
		if (offerStep === 'message' || offerStep === 'addAnnother') {
			ctx.session.offerStep = null;
			ctx.session.currentFlow = 'main';

			return await ctx.reply(ctx.t('home'), {
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
	} else if (flow === 'report') {
		if (reportOffer == 'message' || reportOffer === 'confirmMessage') {
			ctx.session.problemStep = null;
			ctx.session.currentFlow = 'main';

			return await ctx.reply(ctx.t('home'), {
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
	}
};
