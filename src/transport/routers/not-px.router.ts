import { Router as ExpressRouter } from 'express';

import { Router } from '@/shared/libs/router.lib';
import { NotPxController } from '@/app/controllers';

export class NotPxRouter extends Router<NotPxController> {
	constructor(router: ExpressRouter) {
		super(router, '/not-px', new NotPxController());

		this.post('/count', this.controller.count);
	}
}
