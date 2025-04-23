import { MyContext } from '../middlewares/session';

export const profileCommand = async (ctx: MyContext) => {
	await ctx.reply(
		`Registration complete ✅\nName: ${ctx.session.user.fullName}\nEmail: ${ctx.session.user.phone}`,
	);
};
