import { Request, Response } from 'express';

import { Controller } from '@/shared/libs/controller.lib';
import { ConnectWalletReqBody } from '@/transport/requests';
import { AccountService } from '@/app/services';
import { AccountResponse } from '@/transport/responses';

export class AccountController extends Controller {
	private accountSvc: AccountService;
	private accountRes: AccountResponse;

	constructor() {
		super();

		this.accountSvc = new AccountService();
		this.accountRes = new AccountResponse();
	}

	/**
	 * Connect Wallet - Account Controller
	 *
	 * @param req
	 * @param res
	 */
	public async connectWallet(req: Request, res: Response): Promise<void> {
		try {
			const reqBody = await this.getRequestBody(
				ConnectWalletReqBody,
				req,
			);

			const result = await this.accountSvc.connectWallet(res, reqBody);

			this.response(
				res,
				'Wallet connected',
				this.STATUS_CODE.OK,
				this.accountRes.connectWallet(result),
			);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.connectWallet.name);
		}
	}
}
