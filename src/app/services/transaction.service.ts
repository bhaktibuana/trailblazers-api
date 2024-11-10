import { Response } from 'express';

import { Service } from '@/shared/libs/service.lib';
import {
	CalculateGasPriceReqQuery,
	RpcListReqQuery,
} from '@/transport/requests';
import { Res } from '@/shared/types/express';
import { Web3 } from '@/shared/utils';
import { Helper } from '@/shared/helpers';
import {
	I_CalculateGasPriceSvcResult,
	I_RpcListSvcResult,
} from '@/shared/interfaces';

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
			} as I_CalculateGasPriceSvcResult;
		} catch (error) {
			await this.catchErrorHandler(
				res,
				error,
				this.calculateGasPrice.name,
			);
		}
		return null;
	}

	/**
	 * Get RPC List - Transaction Service
	 *
	 * @param res
	 * @param reqQuery
	 * @returns
	 */
	public async rpcList(res: Response, reqQuery: RpcListReqQuery) {
		try {
			const web3Util = new Web3(reqQuery.network_type);
			const web3 = web3Util.web3;

			if (!web3)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Can not connect to web3 network',
				);

			const rpcs = Helper.getRpcList(reqQuery.network_type);

			let result: I_RpcListSvcResult['rpc_list'] = [];

			for (let i = 0; i < rpcs.length; i++) {
				const latencyStatus = await web3Util.getRpcLatency(rpcs[i]);
				result.push({
					...rpcs[i],
					is_online: latencyStatus.is_online,
					latency: latencyStatus.latency,
				});
			}

			result = result.sort((a, b) => {
				if (a.is_online === b.is_online) {
					return (a.latency as number) - (b.latency as number);
				}
				return a.is_online ? -1 : 1;
			});

			result = result.map((rpc) => ({
				...rpc,
				latency: `${(rpc.latency as number) / 1000}s`,
			}));

			return {
				network_type: reqQuery.network_type,
				rpc_list: result,
			} as I_RpcListSvcResult;
		} catch (error) {
			await this.catchErrorHandler(res, error, this.rpcList.name);
		}
		return null;
	}
}
