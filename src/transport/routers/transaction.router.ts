import { Router as ExpressRouter } from 'express';

import { Router } from '@/shared/libs/router.lib';
import { TransactionController } from '@/app/controllers';

export class TransactionRouter extends Router<TransactionController> {
	constructor(router: ExpressRouter) {
		super(router, '/account', new TransactionController());
	}
}
