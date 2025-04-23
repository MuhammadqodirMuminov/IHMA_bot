import { config } from 'dotenv';
import { Bot } from 'grammy';
import { profileCommand } from './commands/profile';
import { startCommand } from './commands/start';
import { ConnectDb } from './config/database.config';
import { callbackQueryHandler } from './handlers/common/calback-query.handler';
import { globalTextHandler } from './handlers/common/global-handler.handler';
import { contactHandler } from './handlers/registration/contact.handler';
import { i18n } from './middlewares/i18n';
import { MyContext, session } from './middlewares/session';
import { errorHandler } from './utils/error-handler';
import { setMyCommands } from './utils/set-my-commands';

config();

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

ConnectDb();

bot.use(i18n);
bot.use(session);
bot.use(i18n.middleware());

setMyCommands(bot);

bot.command('start', startCommand);
bot.command('profile', profileCommand);

bot.on('message:text', globalTextHandler);
bot.on('message:contact', contactHandler);

bot.on('callback_query:data', callbackQueryHandler);

bot.catch(errorHandler);
bot.start();
