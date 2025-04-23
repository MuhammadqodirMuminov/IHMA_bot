import { Bot } from 'grammy';
import { MyContext } from '../middlewares/session';

export const setMyCommands = (bot: Bot<MyContext>) => {
	bot.api.setMyCommands([{ command: 'start', description: 'Start the bot' }]);
};
