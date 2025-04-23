import mongoose from 'mongoose';

export const ConnectDb = () => {
	mongoose
		.connect(
			'mongodb+srv://myAtlasDBUser:elbe@myatlasclusteredu.7xhwm.mongodb.net/?retryWrites=true&w=majority&appName=myAtlasClusterEDU',
		)
		.then(() => {
			console.log('MongoDB connected');
		})
		.catch(er => {
			console.log(er);

			throw new Error(er.message);
		});
};
