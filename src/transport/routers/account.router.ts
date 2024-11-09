import { Router as ExpressRouter } from 'express';

import { Router } from '@/shared/libs/router.lib';
import { AccountController } from '@/app/controllers';

export class AccountRouter extends Router<AccountController> {
	constructor(router: ExpressRouter) {
		super(router, '/account', new AccountController());

		this.post('/connect-wallet', this.controller.connectWallet);
		this.get('/balance', this.controller.getBalance, ['auth']);
	}
}
