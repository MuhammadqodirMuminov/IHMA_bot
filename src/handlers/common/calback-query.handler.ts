import { Keyboard } from 'grammy';
import { MyContext } from '../../middlewares/session';

export const callbackQueryHandler = async (ctx: MyContext) => {
	const callbackData = ctx.callbackQuery?.data;
	const step = ctx.session.step;
	const flow = ctx.session.currentFlow;
	const offerStep = ctx.session.offerStep;

	if (flow == 'registration') {
		if (callbackData == 'back') {
			if (step === 'district') {
				await ctx.deleteMessage();

				ctx.session.step = 'phone';
				return ctx.reply(ctx.t('askPhone'), {
					reply_markup: new Keyboard()
						.requestContact(ctx.t('sharePhoneBtn'))
						.row({ text: ctx.t('back') })
						.resized()
						.oneTime(),
				});
			}
		}

		if (step === 'district') {
			ctx.session.step = 'address';
			ctx.session.user.district = callbackData;
			await ctx.deleteMessage();

			ctx.reply(ctx.t('askAdress'), {
				reply_markup: {
					keyboard: [[{ text: ctx.t('back') }]],
					resize_keyboard: true,
					one_time_keyboard: true,
				},
			});
		}
	} else if (flow === 'offer') {
		if (offerStep === 'confirmMessage') {
			if (callbackData === 'reAskOffer') {
				ctx.session.offerStep = 'message';
				await ctx.deleteMessage();
				await ctx.reply(ctx.t('askOffer'), {
					reply_markup: {
						keyboard: [[{ text: ctx.t('cancelBtn') }]],
						resize_keyboard: true,
						one_time_keyboard: true,
					},
				});
				return ctx.answerCallbackQuery();
			} else if (callbackData === 'confirmOffer') {
				ctx.session.offerStep = null;
			}
		}
	}
};
