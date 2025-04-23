import mongoose, { InferSchemaType } from 'mongoose';
import { UserRoles } from '../types/enum';

const userSchema = new mongoose.Schema(
	{
		chatId: { type: Number, required: true, unique: true, index: true },
		role: { type: String, enum: UserRoles, required: true, index: true },
		fullName: String,
		phone: String,
		district: String,
		address: String,
		position: String, // for hodim
		createdAt: { type: Date, default: Date.now },
	},
	{ versionKey: false, timestamps: true },
);

export type IUser = InferSchemaType<typeof userSchema>;

export default mongoose.model('User', userSchema);
