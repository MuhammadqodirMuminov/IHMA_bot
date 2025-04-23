import { Model, Types } from 'mongoose';
import messageModel, { IMessage } from '../models/message.model';
import userModel, { IUser } from '../models/user.model';
import { MessageStatus } from '../types/enum';

export class MessageService {
	constructor(
		private readonly messageModel: Model<IMessage>,
		private readonly userModel: Model<IUser>,
	) {}

	async create(body: Partial<IMessage>, chatId: number) {
		try {
			const user = await this.userModel.findOne({
				chatId,
			});
			const message = await this.messageModel.create({
				user: new Types.ObjectId(user?._id),
				content: body.content,
				status: MessageStatus.PENDING,
				type: body.type,
			});

			return await message.save();
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
}
export default new MessageService(messageModel, userModel);
