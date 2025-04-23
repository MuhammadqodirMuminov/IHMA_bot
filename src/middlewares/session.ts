import { I18nFlavor } from '@grammyjs/i18n';
import { Context, SessionFlavor, session as grammYSession } from 'grammy';

export interface SessionData {
	chatId?: number;
	step: 'idle' | 'fullName' | 'phone' | 'district' | 'address' | 'confirm' | null;
	currentFlow: 'language' | 'registration' | 'profile' | 'main' | 'offer' | null;
	user: {
		fullName?: string;
		phone?: string;
		district?: string;
		address?: string;
	};
	offerStep?: 'message' | 'confirmMessage' | 'addAnnother' | null;
	offer: string | null;
}

function initialSession(): SessionData {
	return {
		step: 'idle',
		currentFlow: 'language',
		user: {},
		offer: null,
	};
}

export type MyContext = Context & SessionFlavor<SessionData> & I18nFlavor;

export const session = grammYSession<SessionData, MyContext>({
	initial: initialSession,
});
