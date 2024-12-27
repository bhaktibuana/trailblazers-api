import { Response } from 'express';

import { Service } from '@/shared/libs/service.lib';
import { NotPxApi } from '@/app/apis';
import { NotPx } from '@/app/models';

export class NotPxService extends Service {
	private notPxApi: NotPxApi;

	constructor() {
		super();

		this.notPxApi = new NotPxApi();
	}

	public async count(res: Response) {
		try {
			this.execute(res);

			return {
				message: 'counting',
			};
		} catch (error) {
			await this.catchErrorHandler(res, error, this.count.name);
		}
		return null;
	}

	private async execute(res: Response) {
		try {
			const perBatch = 10000;
			const limit = perBatch.toString();
			let offset = '0';

			while (true) {
				const resultPerBatch = await this.calculate(res, limit, offset);

				if (resultPerBatch === null || !resultPerBatch.success) {
					break;
				} else {
					const notPx = new NotPx();
					const existingData = await notPx.getRaw([
						{
							$match: {
								total_user: {
									$gte: 0,
								},
								min_balance: {
									$gte: 100000,
								},
							},
						},
					]);

					if (existingData.length > 0) {
						const data = existingData[0];
						notPx.findOneAndUpdate(
							{ _id: data._id },
							{
								total_balance:
									(data.total_balance as number) +
									resultPerBatch.total_balance,
								total_repaint:
									(data.total_repaint as number) +
									resultPerBatch.total_repaint,
								total_user:
									(data.total_user as number) +
									resultPerBatch.total_user,
							},
						);
					} else {
						notPx.payload = {
							tier: 'platinum',
							min_balance: 100000,
							total_balance: resultPerBatch.total_balance,
							total_repaint: resultPerBatch.total_repaint,
							total_user: resultPerBatch.total_user,
						};
						notPx.save();
					}

					offset = (parseInt(offset) + perBatch).toString();
				}
			}

			return {
				message: 'counting',
			};
		} catch (error) {
			await this.catchErrorHandler(res, error, this.execute.name);
		}
		return null;
	}

	private async calculate(res: Response, limit: string, offset: string) {
		try {
			const params = {
				limit,
				offset,
			};

			const users = await this.notPxApi.getUser(params);
			const result = {
				success: false,
				total_balance: 0,
				total_repaint: 0,
				total_user: 0,
			};

			if (users?.top) {
				const userObj = users.top;
				const userKeys = Object.keys(userObj);

				if (userKeys.length > 0) {
					for (let i = 0; i < userKeys.length; i++) {
						const key = userKeys[i];
						const data = userObj[key];

						if (data.balance < 100000) continue;

						result.total_balance += data.balance;
						result.total_repaint += data.repaints;
						result.total_user += 1;
					}
					result.success = true;
				} else {
					result.success = false;
				}
			} else {
				result.success = false;
			}
			return result;
		} catch (error) {
			await this.catchErrorHandler(res, error, this.calculate.name);
		}
		return null;
	}
}
