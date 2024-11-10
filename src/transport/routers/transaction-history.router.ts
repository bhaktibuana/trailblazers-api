import { Router as ExpressRouter } from 'express';

import { Router } from '@/shared/libs/router.lib';
import { TransactionHistoryController } from '@/app/controllers';

export class TransactionHistoryRouter extends Router<TransactionHistoryController> {
	constructor(router: ExpressRouter) {
		super(
			router,
			'/transaction-history',
			new TransactionHistoryController(),
		);

		this.get('/list', this.controller.list, ['auth']);
	}
}
