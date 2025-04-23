import { Keyboard } from 'grammy';
import { MyContext } from '../../middlewares/session';

export const stepsHandler = async (ctx: MyContext) => {
	const step = ctx.session.step;
	const msg = ctx.message?.text;

	if (ctx.session.currentFlow === 'registration') {
		if (step === 'fullName' && msg !== ctx.t('back')) {
			ctx.session.user.fullName = msg;
			ctx.session.step = 'phone';
			return await ctx.reply(ctx.t('askPhone'), {
				reply_markup: new Keyboard()
					.requestContact(ctx.t('sharePhoneBtn'))
					.row({ text: ctx.t('back') })
					.resized()
					.oneTime(),
			});
		}

		if (step === 'address') {
			ctx.session.user.address = msg;
			ctx.session.step = 'confirm';

			await ctx.reply(
				ctx.t('sessionSummary', {
					fullName: ctx.session.user.fullName || '',
					phone: ctx.session.user.phone || '',
					district: ctx.session.user.district || '',
					neighborhood: ctx.session.user.address || '',
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
	}
};
