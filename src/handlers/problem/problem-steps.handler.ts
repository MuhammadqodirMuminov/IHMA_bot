import { InlineKeyboard } from 'grammy';
import { MyContext } from '../../middlewares/session';

export const problemStepsHandler = async (ctx: MyContext) => {
	const flow = ctx.session.currentFlow;
	const problemStep = ctx.session.problemStep;
	const msg = ctx.message?.text;

	if (flow === 'report') {
		if (problemStep === 'message') {
			ctx.session.problemStep = 'confirmMessage';
			await ctx.reply(msg!);
			ctx.session.report = msg!;
			return await ctx.reply(ctx.t('askOfferConfirm'), {
				reply_markup: {
					inline_keyboard: new InlineKeyboard([
						[
							{
								text: ctx.t('confirmOfferBtn'),
								callback_data: 'confirmReport',
							},
						],
						[
							{
								text: ctx.t('reAskOfferBtn'),
								callback_data: 'reAskReport',
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
