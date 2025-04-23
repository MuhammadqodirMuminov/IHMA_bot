import { InlineKeyboard } from 'grammy';
import { MyContext } from '../../middlewares/session';

export const offerStepsHandler = async (ctx: MyContext) => {
	const flow = ctx.session.currentFlow;
	const offerStep = ctx.session.offerStep;
	const msg = ctx.message?.text;

	if (flow === 'offer') {
		if (offerStep === 'message') {
			ctx.session.offerStep = 'confirmMessage';
			await ctx.reply(msg!);
			ctx.session.offer = msg!;
			return await ctx.reply(ctx.t('askOfferConfirm'), {
				reply_markup: {
					inline_keyboard: new InlineKeyboard([
						[
							{
								text: ctx.t('confirmOfferBtn'),
								callback_data: 'confirmOffer',
							},
						],
						[
							{
								text: ctx.t('reAskOfferBtn'),
								callback_data: 'reAskOffer',
							},
						],
					]).inline_keyboard,
					resize_keyboard: true,
					one_time_keyboard: true,
				},
			});
		}
	}
};
