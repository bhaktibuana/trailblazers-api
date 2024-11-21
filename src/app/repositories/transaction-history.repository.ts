import { Response } from 'express';
import {
	FindAttributeOptions,
	InferCreationAttributes,
	Transaction as SequelizeTransaction,
	WhereOptions,
	Op,
	fn,
	literal,
	col,
} from 'sequelize';
import dayjs from 'dayjs';

import { Repository } from '@/shared/libs/repository.lib';
import { Transaction, TransactionHistory } from '@/app/models';
import {
	I_Pagination,
	I_TxHistoryListQueryPayload,
	I_TxHistoryScoreboardQueryPayload,
	I_TxHistoryScoreboardResult,
} from '@/shared/interfaces';
import { Helper } from '@/shared/helpers';

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
			result = await TransactionHistory.findOne({
				where: {
					...where,
					deleted_at: null,
				},
				attributes,
			});
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
		transaction: SequelizeTransaction | null = null,
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
				{ where: { id, deleted_at: null } },
			);
			result = await this.findOneById(res, id);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.updateById.name);
		}
		return result;
	}

	/**
	 * Get list (raw)
	 *
	 * @param res
	 * @param payload
	 * @returns
	 */
	public async getList(
		res: Response | null,
		payload: I_TxHistoryListQueryPayload,
	): Promise<{
		transaction_histories: TransactionHistory[];
		pagination: I_Pagination | null;
	}> {
		let result: {
			transaction_histories: TransactionHistory[];
			pagination: I_Pagination | null;
		} = {
			transaction_histories: [],
			pagination: null,
		};

		const where: WhereOptions<TransactionHistory> = {
			deleted_at: null,
		};

		if (payload.transaction_hash)
			where.transaction_hash = payload.transaction_hash;
		if (payload.method) where.method = payload.method;
		if (payload.status) where.status = payload.status;

		if (payload.start_date && payload.end_date) {
			where.created_at = {
				[Op.and]: [
					{ [Op.gte]: payload.start_date }, // Start date condition
					{ [Op.lte]: payload.end_date }, // End date condition
				],
			};
		} else if (payload.start_date) {
			where.created_at = {
				[Op.gte]: payload.start_date, // Only start date
			};
		} else if (payload.end_date) {
			where.created_at = {
				[Op.lte]: payload.end_date, // Only end date
			};
		}

		try {
			const count = await TransactionHistory.count({
				where,
				include: [
					{
						model: Transaction,
						as: 'transaction',
						where: {
							address: payload.address,
							network_type: payload.network_type,
						},
						attributes: ['id'],
					},
				],
			});

			result.transaction_histories = await TransactionHistory.findAll({
				where,
				include: [
					{
						model: Transaction,
						as: 'transaction',
						where: {
							address: payload.address,
							network_type: payload.network_type,
						},
						attributes: {
							exclude: ['deleted_at'],
						},
					},
				],
				attributes: {
					exclude: ['deleted_at'],
				},
				order: [[payload.sort_by, payload.sort]],
				offset: (payload.page - 1) * payload.per_page,
				limit: payload.per_page,
			});

			result.pagination = Helper.generatePagination(
				payload.page,
				payload.per_page,
				count,
			);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.getList.name);
		}
		return result;
	}

	/**
	 * Get scoreboard (raw)
	 *
	 * @param res
	 * @param payload
	 * @returns
	 */
	public async scoreboard(
		res: Response | null,
		payload: I_TxHistoryScoreboardQueryPayload,
	): Promise<I_TxHistoryScoreboardResult[]> {
		let result: TransactionHistory[] = [];

		const where: WhereOptions<TransactionHistory> = {
			deleted_at: null,
		};

		if (payload.start_date && payload.end_date) {
			where.created_at = {
				[Op.and]: [
					{ [Op.gte]: payload.start_date }, // Start date condition
					{ [Op.lte]: payload.end_date }, // End date condition
				],
			};
		} else if (payload.start_date) {
			where.created_at = {
				[Op.gte]: payload.start_date, // Only start date
			};
		} else if (payload.end_date) {
			where.created_at = {
				[Op.lte]: payload.end_date, // Only end date
			};
		}

		try {
			result = await TransactionHistory.findAll({
				where,
				include: [
					{
						model: Transaction,
						as: 'transaction',
						where: {
							address: payload.address,
							network_type: payload.network_type,
						},
						attributes: ['id'],
					},
				],
				attributes: [
					'transaction.id',
					[
						fn(
							'COUNT',
							literal(
								"CASE WHEN TransactionHistory.status = 'completed' THEN 1 END",
							),
						),
						'completed_tx_count',
					],
					[
						fn(
							'COUNT',
							literal(
								"CASE WHEN TransactionHistory.status = 'pending' THEN 1 END",
							),
						),
						'pending_tx_count',
					],
					[
						fn(
							'COUNT',
							literal(
								"CASE WHEN TransactionHistory.status = 'reverted' THEN 1 END",
							),
						),
						'reverted_tx_count',
					],
					[
						fn(
							'COUNT',
							literal(
								"CASE WHEN TransactionHistory.method = 'wrap' THEN 1 END",
							),
						),
						'wrap_count',
					],
					[
						fn(
							'COUNT',
							literal(
								"CASE WHEN TransactionHistory.method = 'unwrap' THEN 1 END",
							),
						),
						'unwrap_count',
					],
					[
						fn(
							'SUM',
							literal(
								'CASE WHEN TransactionHistory.transaction_fee IS NOT NULL THEN amount END',
							),
						),
						'total_eth_swap',
					],
					[
						fn(
							'AVG',
							literal(
								'CASE WHEN TransactionHistory.transaction_fee IS NOT NULL THEN amount END',
							),
						),
						'avg_eth_swap',
					],
					[fn('SUM', col('transaction_fee')), 'total_tx_fee'],
					[fn('AVG', col('transaction_fee')), 'avg_tx_fee'],
				],
				group: ['transaction.id'],
				raw: true,
			});
		} catch (error) {
			await this.catchErrorHandler(res, error, this.scoreboard.name);
		}
		return result as never as I_TxHistoryScoreboardResult[];
	}
}
