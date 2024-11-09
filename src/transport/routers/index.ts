import { Router } from 'express';

import { BaseRouter } from '@/transport/routers/base.router';
import * as routers from '@/transport/routers/package';

export class Routers extends BaseRouter {
	public readonly appRouter: Router;

	constructor() {
		super();

		this.appRouter = Router();
		this.appRoutes(this.appRouter);
		this.index(this.appRouter);
	}

	/**
	 * App Route lists
	 *
	 * @param router
	 */
	private appRoutes(router: Router): void {
		const routerKeys = Object.keys(routers) as Array<keyof typeof routers>;
		routerKeys.forEach((routerKey) => {
			new routers[routerKey](router);
		});
	}
}
