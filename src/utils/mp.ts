import { MyContext } from '../middlewares/session';

export const backKeyboard = (ctx: MyContext) => [[{ text: ctx.t('back') }]];
