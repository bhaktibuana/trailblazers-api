import { Response } from 'express';

import { Service } from '@/shared/libs/service.lib';
import {
	ListReqQuery,
	ScoreboardReqQuery,
} from '@/transport/requests/transaction-history.request';
import { Res } from '@/shared/types/express';
import {
	I_Pagination,
	I_TxHistoryListQueryPayload,
	I_TxHistoryScoreboardQueryPayload,
	I_TxHistoryScoreboardResult,
} from '@/shared/interfaces';
import { TransactionHistoryRepository } from '../repositories';
import { TransactionHistory } from '@/app/models';

export class TransactionHistoryService extends Service {
	private transactionHistoryRepo: TransactionHistoryRepository;

	constructor() {
		super();

		this.transactionHistoryRepo = new TransactionHistoryRepository();
	}

	/**
	 * List - Transaction History Service
	 *
	 * @param res
	 * @param reqQuery
	 * @returns
	 */
	public async list(
		res: Response,
		reqQuery: ListReqQuery,
	): Promise<{
		transaction_histories: TransactionHistory[];
		pagination: I_Pagination | null;
	}> {
		const account = (res as Res).locals.account;

		try {
			const queryPaylaod: I_TxHistoryListQueryPayload = {
				transaction_hash: reqQuery.transaction_hash,
				method: reqQuery.method,
				status: reqQuery.status,
				start_date: reqQuery.start_date,
				end_date: reqQuery.end_date,
				sort_by: reqQuery.sort_by,
				sort: reqQuery.sort,
				page: reqQuery.page,
				per_page: reqQuery.per_page,
				address: account.address.toLowerCase(),
				network_type: account.network_type,
			};

			return await this.transactionHistoryRepo.getList(res, queryPaylaod);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.list.name);
		}
		return { transaction_histories: [], pagination: null };
	}

	/**
	 * Scoreboard - Transaction History Service
	 *
	 * @param res
	 * @param reqQuery
	 * @returns
	 */
	public async scoreboard(
		res: Response,
		reqQuery: ScoreboardReqQuery,
	): Promise<I_TxHistoryScoreboardResult[]> {
		const account = (res as Res).locals.account;

		try {
			const queryPaylaod: I_TxHistoryScoreboardQueryPayload = {
				start_date: reqQuery.start_date,
				end_date: reqQuery.end_date,
				address: account.address.toLowerCase(),
				network_type: account.network_type,
			};

			return await this.transactionHistoryRepo.scoreboard(
				res,
				queryPaylaod,
			);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.scoreboard.name);
		}
		return [];
	}
}
