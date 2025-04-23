import { Model, Types } from 'mongoose';
import userModel, { IUser } from '../models/user.model';

class UserService {
	constructor(private readonly usermodel: Model<IUser>) {}

	async create(body: Partial<IUser>) {
		try {
			const newUser = await this.usermodel.create({
				_id: new Types.ObjectId(),
				...body,
			});

			return await newUser.save();
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	async createOrUpdate(body: Partial<IUser>): Promise<boolean> {
		const user = await this.findByTelegramId(body.chatId!);
		if (user) {
			await this.usermodel.updateOne(
				{ _id: new Types.ObjectId(user._id) },
				{
					fullName: body.fullName,
					phone: body.phone,
					address: body.address,
					district: body.district,
				},
			);
		} else {
			await this.create(body);
		}
		return true;
	}

	async findByTelegramId(chatId: number) {
		const user = this.usermodel.findOne({ chatId });
		return user;
	}
}

export default new UserService(userModel);
