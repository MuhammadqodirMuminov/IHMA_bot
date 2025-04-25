import mongoose, { InferSchemaType } from 'mongoose';

const userPreferancesSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
		content: String,
		name: { type: Boolean, required: true, default: true },
		phone: { type: Boolean, required: true, default: true },
		address: { type: Boolean, required: true, default: true },
	},
	{ versionKey: false, timestamps: true },
);

export type IUserPreferances = InferSchemaType<typeof userPreferancesSchema>;

export default mongoose.model('UserPreferances', userPreferancesSchema);
