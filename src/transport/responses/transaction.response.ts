import {
	I_CalculateGasPriceSvcResult,
	I_RpcListSvcResult,
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
}
