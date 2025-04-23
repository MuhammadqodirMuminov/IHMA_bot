import { MyContext } from '../../middlewares/session';

export const offerHandler = async (ctx: MyContext) => {
	const flow = ctx.session.currentFlow;

	if (flow === 'main') {
		ctx.session.offerStep = 'message';
		ctx.session.currentFlow = 'offer';
		return await ctx.reply(ctx.t('askOffer'), {
			reply_markup: {
				keyboard: [[{ text: ctx.t('cancelBtn') }]],
				resize_keyboard: true,
				one_time_keyboard: true,
			},
		});
	}
};
