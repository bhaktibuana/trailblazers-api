import { Response } from 'express';

import { Service } from '@/shared/libs/service.lib';
import { ConnectWalletReqBody } from '@/transport/requests';
import { Web3 } from '@/shared/utils';
import { I_Account } from '@/shared/interfaces';
import { Helper } from '@/shared/helpers';

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
}
