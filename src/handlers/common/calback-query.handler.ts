import { config } from 'dotenv';
import { InlineKeyboard, Keyboard } from 'grammy';
import { InlineKeyboardButton } from 'grammy/types';
import { MyContext } from '../../middlewares/session';
import { IUserPreferances } from '../../models/user-preferances.model';
import messageService from '../../services/message.service';
import userPreferancesService from '../../services/user-preferances.service';
import userService from '../../services/user.service';
import { MessageType } from '../../types/enum';
config();
export const groupId = process.env.GROUP_ID!;

export const callbackQueryHandler = async (ctx: MyContext) => {
	const callbackData = ctx.callbackQuery?.data;
	const step = ctx.session.step;
	const flow = ctx.session.currentFlow;
	const offerStep = ctx.session.offerStep;
	const reportStep = ctx.session.problemStep;

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
	} else if (flow === 'report') {
		if (reportStep === 'preferances') {
			if (callbackData?.startsWith('edit')) {
				const [command, field, id] = callbackData.split(':');
				const currentPreference: IUserPreferances =
					await userPreferancesService.getOrCreate(id);

				const updatedField: Record<string, any> = {};
				if (
					field &&
					(field === 'name' || field === 'phone' || field === 'address')
				) {
					const key = field as keyof typeof currentPreference;
					updatedField[key] = !currentPreference[key];
				}

				const newPreferance = await userPreferancesService.updateOne(id, {
					...updatedField,
				});

				const user = await userService.findByTelegramId(ctx.chatId!);

				const inlineKeyboard: InlineKeyboardButton[][] = [
					[
						{
							text: `${user?.fullName} ${
								newPreferance?.name ? '✅' : '❌'
							}`,
							callback_data: `edit:name:${user?._id}`,
						},
					],
					[
						{
							text: `${user?.phone} ${
								newPreferance?.phone ? '✅' : '❌'
							}`,
							callback_data: `edit:phone:${user?._id}`,
						},
					],
					[
						{
							text: `${user?.address} ${
								newPreferance?.address ? '✅' : '❌'
							}`,
							callback_data: `edit:address:${user?._id}`,
						},
					],
					[
						{
							text: ctx.t('confirmSettingsBtn'),
							callback_data: `confirmSettingsBtn`,
						},
					],
				];

				await ctx.editMessageReplyMarkup({
					reply_markup: { inline_keyboard: inlineKeyboard },
				});

				await ctx.answerCallbackQuery();
			} else if (callbackData === 'confirmSettingsBtn') {
				ctx.session.problemStep = 'message';
				await ctx.deleteMessage();
				await ctx.reply(ctx.t('askOffer'), {
					reply_markup: {
						resize_keyboard: true,
						one_time_keyboard: true,
						keyboard: [[{ text: ctx.t('cancelBtn') }]],
					},
				});
				return await ctx.answerCallbackQuery();
			}
		} else if (reportStep === 'confirmMessage') {
			if (callbackData === 'reAskReport') {
				ctx.session.problemStep = 'message';
				await ctx.deleteMessage();
				await ctx.reply(ctx.t('askOffer'), {
					reply_markup: {
						keyboard: [[{ text: ctx.t('cancelBtn') }]],
						resize_keyboard: true,
						one_time_keyboard: true,
					},
				});
				return ctx.answerCallbackQuery();
			} else if (callbackData === 'confirmReport') {
				const msg = ctx.session.report;
				await ctx.deleteMessage();
				ctx.session.report = null;

				const message = await messageService.create(
					{
						content: msg,
						type: MessageType.REPORT,
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

				ctx.session.problemStep = null;
				ctx.session.currentFlow = 'main';

				await ctx.reply(ctx.t('sendedReport'), {
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
				return ctx.answerCallbackQuery();
			}
		}
	}
};
