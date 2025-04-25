import { MyContext } from '../../middlewares/session';
import { setLanguageHandler } from '../language/set-lang.handler';
import { offerStepsHandler } from '../offer/offer-steps.handler';
import { offerHandler } from '../offer/offer.handler';
import { problemStepsHandler } from '../problem/problem-steps.handler';
import { problemhandler } from '../problem/problem.handler';
import { profileHandler } from '../profile/profile.handler';
import { confirmUserHandler } from '../registration/confirm.handler';
import { registrationHandler } from '../registration/register.handler';
import { rejectUserHandler } from '../registration/reject.handler';
import { stepsHandler } from '../registration/step-handler.handler';
import { BackButtonHandler } from './back.handler';
import { cancelHandler } from './cancel-btn.handler';

export const globalTextHandler = async (ctx: MyContext) => {
	const msg = ctx.message?.text;
	console.log('session', ctx.session);
	console.log('msg', msg);

	if (msg === "O'zbek tili") {
		return await setLanguageHandler(ctx, 'uz');
	} else if (msg === 'Русский язык') {
		return await setLanguageHandler(ctx, 'ru');
	} else if (msg === 'Ўзбек тили') {
		return await setLanguageHandler(ctx, 'oz');
	} else if (msg === ctx.t('registerBtn')) {
		return await registrationHandler(ctx);
	} else if (msg === ctx.t('yes')) {
		return await confirmUserHandler(ctx);
	} else if (msg === ctx.t('no')) {
		return await rejectUserHandler(ctx);
	} else if (msg === ctx.t('profileBtn')) {
		return await profileHandler(ctx);
	} else if (msg === ctx.t('offerBtn')) {
		return await offerHandler(ctx);
	} else if (msg === ctx.t('problemBtn')) {
		return await problemhandler(ctx);
	} else if (msg === ctx.t('cancelBtn')) {
		return await cancelHandler(ctx);
	}

	await BackButtonHandler(ctx);
	await stepsHandler(ctx);
	await offerStepsHandler(ctx);
	await problemStepsHandler(ctx);
};
