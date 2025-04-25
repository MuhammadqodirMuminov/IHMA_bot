import { Model, Types } from 'mongoose';
import userPreferancesModel, { IUserPreferances } from '../models/user-preferances.model';

export class UserPreferancesService {
	constructor(private readonly userPreferancesModel: Model<IUserPreferances>) {}

	async getOrCreate(userId: string) {
		try {
			const existPreferances = await this.userPreferancesModel.findOne({
				user: new Types.ObjectId(userId),
			});
			if (existPreferances) {
				return existPreferances;
			} else {
				const newPreferances = await this.userPreferancesModel.create({
					user: new Types.ObjectId(userId),
				});
				return newPreferances.save();
			}
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	async updateOne(userId: string, body: Partial<IUserPreferances>) {
		const update = await this.userPreferancesModel
			.updateOne(
				{
					user: new Types.ObjectId(userId),
				},
				{ ...body },
			)
			.lean();

		return await this.userPreferancesModel.findOne({ user: new Types.ObjectId(userId) });
	}
}
export default new UserPreferancesService(userPreferancesModel);
