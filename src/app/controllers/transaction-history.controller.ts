import { Request, Response } from 'express';

import { Controller } from '@/shared/libs/controller.lib';
import { ListReqQuery } from '@/transport/requests/transaction-history.request';
import { TransactionHistoryService } from '@/app/services';
import { TransactionHistoryResponse } from '@/transport/responses';

export class TransactionHistoryController extends Controller {
	private transactionHistorySvc: TransactionHistoryService;
	private transactionHistoryRes: TransactionHistoryResponse;

	constructor() {
		super();

		this.transactionHistorySvc = new TransactionHistoryService();
		this.transactionHistoryRes = new TransactionHistoryResponse();
	}

	/**
	 * List - Transaction History Controller
	 *
	 * @param req
	 * @param res
	 */
	public async list(req: Request, res: Response): Promise<void> {
		try {
			const reqBody = await this.getRequestQuery(ListReqQuery, req);

			const { transaction_histories: results, pagination } =
				await this.transactionHistorySvc.list(res, reqBody);

			this.responsePagination(
				res,
				'Wallet connected',
				this.STATUS_CODE.OK,
				this.transactionHistoryRes.list(results),
				pagination,
			);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.list.name);
		}
	}
}
