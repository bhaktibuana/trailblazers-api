import { Response } from 'express';

import { Service } from '@/shared/libs/service.lib';
import { CalculateGasPriceReqQuery } from '@/transport/requests';
import { Res } from '@/shared/types/express';
import { Web3 } from '@/shared/utils';

export class TransactionService extends Service {
	constructor() {
		super();
	}

	/**
	 * Calculate Gas Price - Transaction Service
	 *
	 * @param res
	 * @param reqQuery
	 * @returns
	 */
	public async calculateGasPrice(
		res: Response,
		reqQuery: CalculateGasPriceReqQuery,
	) {
		const account = (res as Res).locals.account;

		try {
			const web3Util = new Web3(account.network_type, account.rpc_id);
			const web3 = web3Util.web3;

			if (!web3)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Can not connect to web3 network',
				);

			const gasPrice = await web3Util.getGasPrice(
				reqQuery.increase_percentage,
			);

			if (!gasPrice)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Failed to get gas price',
				);

			return {
				network_type: account.network_type,
				base_gas_price:
					web3?.utils.fromWei(
						gasPrice?.base_gas_price as bigint,
						'ether',
					) + ' ETH',
				increased_gas_price:
					web3?.utils.fromWei(
						gasPrice?.increased_gas_price as bigint,
						'ether',
					) + ' ETH',
			};
		} catch (error) {
			await this.catchErrorHandler(
				res,
				error,
				this.calculateGasPrice.name,
			);
		}
		return null;
	}
}
