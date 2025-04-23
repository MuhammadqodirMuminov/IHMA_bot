import { InlineKeyboard, Keyboard } from 'grammy';
import { districtKeys } from '../../constants/destrict.constants';
import { MyContext } from '../../middlewares/session';
import { registrationHandler } from '../registration/register.handler';

export const BackButtonHandler = async (ctx: MyContext) => {
	const step = ctx.session.step;
	const flow = ctx.session.currentFlow;
	const msg = ctx.message?.text;

	if (msg === ctx.t('back')) {
		if (flow === 'language') {
			ctx.session.currentFlow = 'language';

			return await ctx.reply(`Тилни танланг:\nTilni tanlang:\nВыбор языка:`, {
				reply_markup: {
					keyboard: [
						[{ text: "O'zbek tili" }, { text: 'Русский язык' }],
						[{ text: 'Ўзбек тили' }],
					],
					resize_keyboard: true,
					one_time_keyboard: true,
				},
			});
		} else if (flow === 'registration') {
			if (step === 'fullName' || step === 'idle') {
				ctx.session.step = 'idle';
				ctx.session.currentFlow = 'language';
				return await ctx.reply(`Тилни танланг:\nTilni tanlang:\nВыбор языка:`, {
					reply_markup: {
						keyboard: [
							[{ text: "O'zbek tili" }, { text: 'Русский язык' }],
							[{ text: 'Ўзбек тили' }],
						],
						resize_keyboard: true,
						one_time_keyboard: true,
					},
				});
			} else if (step === 'phone') {
				return await registrationHandler(ctx);
			}
			if (step === 'district') {
				ctx.session.step = 'phone';
				return ctx.reply(ctx.t('askPhone'), {
					reply_markup: new Keyboard()
						.requestContact(ctx.t('sharePhoneBtn'))
						.row({ text: ctx.t('back') })
						.resized()
						.oneTime(),
				});
			}
			if (step === 'address') {
				ctx.session.step = 'district';
				const districtKeyboard = new InlineKeyboard(
					districtKeys.map(key => [InlineKeyboard.text(ctx.t(key), key)]),
				);

				districtKeyboard.row().text(ctx.t('back'), 'back');

				return await ctx.reply(ctx.t('askDistrict'), {
					reply_markup: districtKeyboard,
				});
			}
		}
	}
};
