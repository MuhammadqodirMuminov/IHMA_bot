import mongoose, { InferSchemaType } from 'mongoose';
import { MessageStatus, MessageType } from '../types/enum';

const messageSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
		content: String,
		status: {
			type: String,
			enum: MessageStatus,
			default: MessageStatus.PENDING,
			index: true,
		},
		type: { type: String, enum: MessageType, required: true, index: true },
	},
	{ versionKey: false, timestamps: true },
);

export type IMessage = InferSchemaType<typeof messageSchema>;

export default mongoose.model('Message', messageSchema);
