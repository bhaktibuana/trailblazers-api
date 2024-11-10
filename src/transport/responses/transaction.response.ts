import { Transaction } from '@/app/models';
import {
	I_CalculateGasPriceSvcResult,
	I_RpcListSvcResult,
	I_StartSvcResult,
} from '@/shared/interfaces';

export class TransactionResponse {
	/**
	 * Calculate Gas Price - Transaction Response
	 *
	 * @param payload
	 * @returns
	 */
	public calculateGasPrice(payload: I_CalculateGasPriceSvcResult | null) {
		if (!payload) return null;
		return payload;
	}

	/**
	 * RPC List - Transaction Response
	 *
	 * @param payload
	 * @returns
	 */
	public rpcList(payload: I_RpcListSvcResult | null) {
		if (!payload) return null;
		return payload;
	}

	/**
	 * Start - Transaction Response
	 *
	 * @param payload
	 * @returns
	 */
	public start(payload: I_StartSvcResult | null) {
		if (!payload) return null;
		return payload;
	}

	/**
	 * Stop - Transaction Response
	 *
	 * @param payload
	 * @returns
	 */
	public stop(payload: Transaction | null) {
		if (!payload) return null;
		console.log(payload.created_at);
		return {
			network_type: payload.network_type,
			address: payload.address,
			status: payload.status,
			stopped_at: payload.updated_at,
		};
	}
}
