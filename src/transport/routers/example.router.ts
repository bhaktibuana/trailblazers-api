import { Router as ExpressRouter } from 'express';

import { Router } from '@/shared/libs/router.lib';
import { ExampleController } from '@/app/controllers';

export class ExampleRouter extends Router<ExampleController> {
	constructor(router: ExpressRouter) {
		super(router, '/example', new ExampleController());
	}
}
