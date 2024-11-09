import { Request, Response } from 'express';

import { Controller } from '@/shared/libs/controller.lib';
import { CalculateGasPriceReqQuery } from '@/transport/requests';
import { TransactionService } from '@/app/services';
import { TransactionResponse } from '@/transport/responses';

export class TransactionController extends Controller {
	private transactionSvc: TransactionService;
	private transactionRes: TransactionResponse;

	constructor() {
		super();

		this.transactionSvc = new TransactionService();
		this.transactionRes = new TransactionResponse();
	}

	/**
	 * Calculate Gas Price - Transaction Controller
	 *
	 * @param req
	 * @param res
	 */
	public async calculateGasPrice(req: Request, res: Response): Promise<void> {
		try {
			const reqQuery = await this.getRequestQuery(
				CalculateGasPriceReqQuery,
				req,
			);

			const result = await this.transactionSvc.calculateGasPrice(
				res,
				reqQuery,
			);

			this.response(
				res,
				'Wallet connected',
				this.STATUS_CODE.OK,
				this.transactionRes.calculateGasPrice(result),
			);
		} catch (error) {
			await this.catchErrorHandler(
				res,
				error,
				this.calculateGasPrice.name,
			);
		}
	}
}
