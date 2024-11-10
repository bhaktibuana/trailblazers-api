import { Request, Response } from 'express';

import { Controller } from '@/shared/libs/controller.lib';
import {
	CalculateGasPriceReqQuery,
	RpcListReqQuery,
} from '@/transport/requests';
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
				'Gas price',
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

	/**
	 * Get RPC List - Transaction Controller
	 *
	 * @param req
	 * @param res
	 */
	public async rpcList(req: Request, res: Response): Promise<void> {
		try {
			const reqQuery = await this.getRequestQuery(RpcListReqQuery, req);

			const result = await this.transactionSvc.rpcList(res, reqQuery);

			this.response(
				res,
				'Wallet connected',
				this.STATUS_CODE.OK,
				this.transactionRes.rpcList(result),
			);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.rpcList.name);
		}
	}
}
