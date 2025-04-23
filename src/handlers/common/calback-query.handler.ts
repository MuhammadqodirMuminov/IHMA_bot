import { config } from 'dotenv';
import { InlineKeyboard, Keyboard } from 'grammy';
import { MyContext } from '../../middlewares/session';
import messageService from '../../services/message.service';
import { MessageType } from '../../types/enum';
config();
export const groupId = process.env.GROUP_ID!;

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
				const msg = ctx.session.offer;
				await ctx.deleteMessage();
				ctx.session.offerStep = 'addAnnother';
				ctx.session.offer = null;

				const message = await messageService.create(
					{
						content: msg,
						type: MessageType.OFFER,
					},
					ctx.chatId!,
				);

				await ctx.api.sendMessage(groupId, msg!, {
					reply_markup: {
						inline_keyboard: [
							[
								{
									text: 'javob berish',
									url: `https://t.me/userNew_Bot?start=replyOffer_${message._id}_${ctx.chatId}`,
								},
							],
						],
					},
				});

				await ctx.reply(ctx.t('sendedOffer'), {
					reply_markup: {
						inline_keyboard: new InlineKeyboard([
							[
								{
									text: ctx.t('yes'),
									callback_data: 'yesAddAnotherMsg',
								},
								{
									text: ctx.t('no'),
									callback_data: 'noAddAnotherMsg',
								},
							],
						]).inline_keyboard,
					},
				});
				return ctx.answerCallbackQuery();
			}
		} else if (offerStep === 'addAnnother') {
			if (callbackData === 'yesAddAnotherMsg') {
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
			} else if (callbackData === 'noAddAnotherMsg') {
				await ctx.deleteMessage();
				ctx.session.currentFlow = 'main';
				ctx.session.offerStep = null;

				return await ctx.reply(ctx.t('home'), {
					reply_markup: {
						keyboard: [
							[
								{ text: ctx.t('offerBtn') },
								{ text: ctx.t('problemBtn') },
							],
							[{ text: ctx.t('profileBtn') }],
						],
						resize_keyboard: true,
						one_time_keyboard: true,
					},
				});
			}
		}
	}
};
