import { Keyboard } from 'grammy';
import { MyContext } from '../../middlewares/session';

export const setLanguageHandler = async (ctx: MyContext, lang: string = 'uz') => {
	const currentFlow = ctx.session.currentFlow;
	let keybord = new Keyboard();

	await ctx.i18n.setLocale(lang);

	if (currentFlow === 'registration' || currentFlow === 'language') {
		ctx.reply(ctx.t('registerMsg'));
		keybord.row({ text: ctx.t('registerBtn') });
	} else if (currentFlow === 'profile') {
		ctx.reply(ctx.t('fullName'));
	}

	keybord.row({ text: ctx.t('back') });
	ctx.session.currentFlow = 'registration';
	ctx.session.step = 'idle';

	await ctx.reply(ctx.t('selectedLang'), {
		reply_markup: {
			keyboard: keybord.build(),
			resize_keyboard: true,
			one_time_keyboard: true,
		},
	});
};
