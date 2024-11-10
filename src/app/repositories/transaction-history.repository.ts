import { Response } from 'express';
import {
	FindAttributeOptions,
	InferCreationAttributes,
	Transaction,
	WhereOptions,
} from 'sequelize';

import { Repository } from '@/shared/libs/repository.lib';
import { TransactionHistory } from '@/app/models';
import dayjs from 'dayjs';

export class TransactionHistoryRepository extends Repository {
	constructor() {
		super();
	}

	/**
	 * Find one record
	 *
	 * @param res
	 * @param where
	 * @param attributes
	 * @returns
	 */
	public async findOne(
		res: Response | null,
		where: WhereOptions<TransactionHistory>,
		attributes: FindAttributeOptions | undefined = undefined,
	): Promise<TransactionHistory | null> {
		let result: TransactionHistory | null = null;

		try {
			result = await TransactionHistory.findOne({ where, attributes });
		} catch (error) {
			await this.catchErrorHandler(res, error, this.findOne.name);
		}
		return result;
	}

	/**
	 * Create record
	 *
	 * @param res
	 * @param payload
	 * @param transaction
	 * @returns
	 */
	public async create(
		res: Response | null,
		payload: InferCreationAttributes<TransactionHistory>,
		transaction: Transaction | null = null,
	): Promise<TransactionHistory | null> {
		let result: TransactionHistory | null = null;

		try {
			result = await TransactionHistory.create(payload, { transaction });
		} catch (error) {
			await this.catchErrorHandler(res, error, this.create.name);
		}
		return result;
	}

	/**
	 * Find one record by id
	 *
	 * @param res
	 * @param id
	 * @param attributes
	 * @returns
	 */
	public async findOneById(
		res: Response | null,
		id: number,
		attributes: FindAttributeOptions | undefined = undefined,
	): Promise<TransactionHistory | null> {
		let result: TransactionHistory | null = null;

		try {
			result = await this.findOne(res, { id }, attributes);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.findOneById.name);
		}
		return result;
	}

	/**
	 * Update transaction by id
	 *
	 * @param res
	 * @param id
	 * @param payload
	 * @returns
	 */
	public async updateById(
		res: Response | null,
		id: number,
		payload: Partial<TransactionHistory>,
	): Promise<TransactionHistory | null> {
		let result: TransactionHistory | null = null;

		try {
			await TransactionHistory.update(
				{ ...payload, updated_at: dayjs() },
				{ where: { id } },
			);
			result = await this.findOneById(res, id);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.updateById.name);
		}
		return result;
	}
}
