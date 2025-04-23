import { MyContext } from '../../middlewares/session';
import { backKeyboard } from '../../utils/mp';

export const registrationHandler = (ctx: MyContext) => {
	ctx.session.step = 'fullName';
	ctx.session.currentFlow = 'registration';
	return ctx.reply(ctx.t('fullName'), {
		reply_markup: {
			keyboard: backKeyboard(ctx),
			resize_keyboard: true,
			one_time_keyboard: true,
		},
	});
};
