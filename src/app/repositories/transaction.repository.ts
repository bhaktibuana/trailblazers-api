import { Response } from 'express';
import dayjs from 'dayjs';
import {
	FindAttributeOptions,
	InferCreationAttributes,
	Transaction as SequelizeTransaction,
	WhereOptions,
} from 'sequelize';

import { Repository } from '@/shared/libs/repository.lib';
import { Transaction } from '@/app/models';
import { T_TransactionStatus } from '@/shared/types';

export class TransactionRepository extends Repository {
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
		where: WhereOptions<Transaction>,
		attributes: FindAttributeOptions | undefined = undefined,
	): Promise<Transaction | null> {
		let result: Transaction | null = null;

		try {
			result = await Transaction.findOne({ where, attributes });
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
		res: Response,
		payload: InferCreationAttributes<Transaction>,
		transaction: SequelizeTransaction | null = null,
	): Promise<Transaction | null> {
		let result: Transaction | null = null;

		try {
			result = await Transaction.create(payload, { transaction });
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
	): Promise<Transaction | null> {
		let result: Transaction | null = null;

		try {
			result = await this.findOne(res, { id }, attributes);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.findOneById.name);
		}
		return result;
	}

	/**
	 * Update transaction status
	 *
	 * @param res
	 * @param id
	 * @param status
	 * @returns
	 */
	public async updateStatus(
		res: Response | null,
		id: number,
		status: T_TransactionStatus,
	): Promise<Transaction | null> {
		let result: Transaction | null = null;

		try {
			await Transaction.update(
				{ status, updated_at: dayjs() },
				{ where: { id } },
			);
			result = await this.findOneById(res, id);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.updateStatus.name);
		}
		return result;
	}

	/**
	 * Find all records
	 *
	 * @param res
	 * @param where
	 * @param attributes
	 * @returns
	 */
	public async findAll(
		res: Response | null,
		where: WhereOptions<Transaction>,
		attributes: FindAttributeOptions | undefined = undefined,
	): Promise<Transaction[]> {
		let results: Transaction[] = [];

		try {
			results = await Transaction.findAll({ where, attributes });
		} catch (error) {
			await this.catchErrorHandler(res, error, this.findAll.name);
		}
		return results;
	}

	/**
	 * Update many transaction
	 *
	 * @param res
	 * @param id
	 * @param status
	 * @returns
	 */
	public async updateMany(
		res: Response | null,
		payload: Partial<Transaction>,
		where: WhereOptions<Transaction>,
		transaction: SequelizeTransaction | null = null,
	): Promise<Transaction[]> {
		let results: Transaction[] = [];
		const dateNow = dayjs();

		try {
			results = await this.findAll(res, where);
			await Transaction.update(
				{ ...payload, updated_at: dateNow },
				{ where, transaction },
			);

			const resultIds = results.map((item) => item.id);
			results = [];
			for (let i = 0; i < resultIds.length; i++) {
				const result = await this.findOneById(
					res,
					resultIds[i] as number,
				);

				if (result) {
					results.push(result);
				}
			}
		} catch (error) {
			await this.catchErrorHandler(res, error, this.updateMany.name);
		}
		return results;
	}
}
