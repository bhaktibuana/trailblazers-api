import { Helper } from '@/shared/helpers';
import { I_Account, I_GetBalanceSvcResult } from '@/shared/interfaces';

export class AccountResponse {
	/**
	 * Connect Wallet - Account Response
	 *
	 * @param payload
	 * @returns
	 */
	public connectWallet(
		payload: { account: I_Account; token: string } | null,
	) {
		if (!payload || !payload.account) return null;
		return {
			network_type: payload.account.network_type,
			rpc: Helper.getRpc(
				payload.account.network_type,
				payload.account.rpc_id,
			)?.url,
			address: payload.account.address,
			token: payload.token,
		};
	}

	/**
	 * Get Balance - Account Response
	 *
	 * @param payload
	 * @returns
	 */
	public getBalance(payload: I_GetBalanceSvcResult | null) {
		if (!payload) return null;
		return payload;
	}
}
