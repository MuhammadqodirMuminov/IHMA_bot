import { InlineKeyboard } from 'grammy';
import { districtKeys } from '../../constants/destrict.constants';
import { MyContext } from '../../middlewares/session';

export const contactHandler = async (ctx: MyContext) => {
	const contact = ctx.message?.contact;
	const phoneNumber = contact?.phone_number;

	ctx.session.step = 'district';
	ctx.session.user.phone = phoneNumber;

	const districtKeyboard = new InlineKeyboard(
		districtKeys.map(key => [InlineKeyboard.text(ctx.t(key), key)]),
	);

	districtKeyboard.row().text(ctx.t('back'), 'back');

	await ctx.reply(ctx.t('askDistrict'), {
		reply_markup: districtKeyboard,
	});
};
