import { I18nFlavor } from '@grammyjs/i18n';
import { Context, SessionFlavor, session as grammYSession } from 'grammy';

export interface SessionData {
	chatId?: number;
	step: 'idle' | 'fullName' | 'phone' | 'district' | 'address' | 'confirm' | null;
	currentFlow: 'language' | 'registration' | 'profile' | 'main' | 'offer' | 'report' | null;
	user: {
		fullName?: string;
		phone?: string;
		district?: string;
		address?: string;
	};
	offerStep?: 'message' | 'confirmMessage' | 'addAnnother' | null;
	problemStep?: 'preferances' | 'message' | 'confirmMessage' | null;
	offer: string | null;
	report: string | null;
}

function initialSession(): SessionData {
	return {
		step: 'idle',
		currentFlow: 'language',
		user: {},
		offer: null,
		report: null,
	};
}

export type MyContext = Context & SessionFlavor<SessionData> & I18nFlavor;

export const session = grammYSession<SessionData, MyContext>({
	initial: initialSession,
});
