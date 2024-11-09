import { Request, Response } from 'express';

import { Controller } from '@/shared/libs/controller.lib';
import { ConnectWalletReqBody } from '@/transport/requests';

export class AccountController extends Controller {
	constructor() {
		super();
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

			// const result = await this.userSvc.login(res, reqBody);

			this.response(
				res,
				'Login success',
				this.STATUS_CODE.OK,
				// this.userRes.login(result),
				{ reqBody },
			);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.connectWallet.name);
		}
	}
}
