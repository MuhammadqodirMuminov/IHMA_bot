import { GrammyError, HttpError } from 'grammy';

export const errorHandler = (err: any) => {
	if (err instanceof GrammyError) {
		console.error('Grammy error:', err.description);
	} else if (err instanceof HttpError) {
		console.error('HTTP error:', err);
	} else {
		console.error('Unknown error:', err);
	}
};
