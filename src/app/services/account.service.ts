import { Response } from 'express';

import { Service } from '@/shared/libs/service.lib';
import { ConnectWalletReqBody } from '@/transport/requests';
import { Web3 } from '@/shared/utils';
import { I_Account, I_BalanceResult } from '@/shared/interfaces';
import { Helper } from '@/shared/helpers';
import { Res } from '@/shared/types/express';
import { Constant } from '@/shared/constants';
import { T_GetBalanceSvcResult, T_TokenName } from '@/shared/types';

export class AccountService extends Service {
	constructor() {
		super();
	}

	/**
	 * Connect Wallet - Account Service
	 *
	 * @param res
	 * @param reqBody
	 * @returns
	 */
	public async connectWallet(res: Response, reqBody: ConnectWalletReqBody) {
		try {
			const web3Util = new Web3(reqBody.network_type, reqBody.rpc_id);
			const web3 = web3Util.web3;

			if (!web3)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Can not connect to web3 network',
				);

			const account = web3Util.connect(reqBody.private_key);

			const tokenPayload: I_Account = {
				address: account.address,
				private_key: account.privateKey,
				network_type: reqBody.network_type,
				rpc_id: reqBody.rpc_id,
			};

			const token = Helper.generateJWT(tokenPayload, '1d');

			return {
				account: tokenPayload,
				token,
			};
		} catch (error) {
			await this.catchErrorHandler(res, error, this.connectWallet.name);
		}
		return null;
	}

	/**
	 * Get Balance - Account Service
	 *
	 * @param res
	 * @returns
	 */
	public async getBalance(
		res: Response,
	): Promise<T_GetBalanceSvcResult | null> {
		const account = (res as Res).locals.account;

		try {
			const web3Util = new Web3(account.network_type, account.rpc_id);
			const web3 = web3Util.web3;

			if (!web3)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Can not connect to web3 network',
				);

			const tokens = Constant.web3.TOKENS;
			const result: { [key in T_TokenName]: I_BalanceResult } = {} as {
				[key in T_TokenName]: I_BalanceResult;
			};

			for (let i = 0; i < tokens.length; i++) {
				result[tokens[i]] = (await web3Util.getBalance(
					account.address,
					tokens[i],
				)) as I_BalanceResult;

				if (!result[tokens[i]]) {
					this.errorHandler(
						this.STATUS_CODE.BAD_REQUEST,
						`Failed to fetch balance of ${tokens[i]}`,
					);
					break;
				}
			}

			return {
				network_type: account.network_type,
				address: account.address,
				...result,
			};
		} catch (error) {
			await this.catchErrorHandler(res, error, this.getBalance.name);
		}
		return null;
	}
}
