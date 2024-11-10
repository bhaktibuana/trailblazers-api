import cron from 'node-cron';
import dayjs from 'dayjs';
import { Op } from 'sequelize';

import { Cron } from '@/shared/libs/cron.lib';
import { TransactionRepository } from '@/app/repositories';
import { Constant } from '@/shared/constants';

export class TransactionCron extends Cron {
	private transactionRepo: TransactionRepository;

	constructor() {
		super();

		this.transactionRepo = new TransactionRepository();
	}

	/**
	 * Stop transaction if status ongoing and already 8 hours
	 *
	 * @param cronHourInterval
	 */
	public stopOngoingTnx(cronHourInterval: number = 1) {
		// execute function every 1 hour
		cron.schedule(`0 */${cronHourInterval} * * *`, async () => {
			const eightHoursAgo = dayjs().subtract(8, 'hours').toDate();

			try {
				await this.transactionRepo.updateMany(
					null,
					{
						status: Constant.transaction.TRANSACTION_STATUS_STOPPED,
					},
					{
						status: Constant.transaction.TRANSACTION_STATUS_ONGOING,
						updated_at: {
							[Op.lt]: eightHoursAgo,
						},
					},
				);
			} catch (error) {
				await this.catchErrorHandler(
					null,
					error,
					this.stopOngoingTnx.name,
				);
			}
		});
	}
}
