import { Request, Response } from 'express';

import { Controller } from '@/shared/libs/controller.lib';
import { NotPxService } from '@/app/services';

export class NotPxController extends Controller {
	private notPxSvc: NotPxService;

	constructor() {
		super();

		this.notPxSvc = new NotPxService();
	}

	public async count(_req: Request, res: Response): Promise<void> {
		try {
			const result = await this.notPxSvc.count(res);

			this.response(res, 'Wallet connected', this.STATUS_CODE.OK, result);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.count.name);
		}
	}
}
