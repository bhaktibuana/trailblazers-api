import { Router as ExpressRouter } from 'express';

import { Router } from '@/shared/libs/router.lib';
import { TransactionController } from '@/app/controllers';

export class TransactionRouter extends Router<TransactionController> {
	constructor(router: ExpressRouter) {
		super(router, '/transaction', new TransactionController());

		this.get('/calculate-gas-price', this.controller.calculateGasPrice, [
			'auth',
		]);
		this.get('/rpc-list', this.controller.rpcList);
		this.post('/start', this.controller.start, ['auth']);
		this.post('/stop', this.controller.stop, ['auth']);
	}
}
