import mongoose, { InferSchemaType } from 'mongoose';

const messageSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		content: String,
		status: { type: String, enum: ['pending', 'reviewed'], default: 'pending' },
		createdAt: { type: Date, default: Date.now },
	},
	{ versionKey: false, timestamps: true },
);

export type IMessage = InferSchemaType<typeof messageSchema>;

export default mongoose.model('Message', messageSchema);
