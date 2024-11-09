import { Router as ExpressRouter } from 'express';

import { Router } from '@/shared/libs/router.lib';
import { AccountController } from '@/app/controllers';

export class ExampleRouter extends Router<AccountController> {
	constructor(router: ExpressRouter) {
		super(router, '/account', new AccountController());
	}
}
