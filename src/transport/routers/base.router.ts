import { Router } from 'express';

import { Config } from '@/config';
import { HTTP } from '@/shared/utils';
import { Constant } from '@/shared/constants';
import { Req, Res, Next } from '@/shared/types/express';

export abstract class BaseRouter {
	public readonly router: Router;

	constructor() {
		this.router = Router();
	}

	/**
	 * Index HTTP Router
	 */
	protected index(appRouter: Router): void {
		this.router.use((req: Req, res: Res, next: Next): void => {
			if (Config.app.NODE_ENV === Constant.app.ENV_PROD) {
				res.locals.base_url = Config.app.BASE_URL;
			} else {
				res.locals.base_url = `${req.protocol}://${req.headers.host}`;
			}
			next();
		});

		this.router.use((_req: Req, res: Res, next: Next): void => {
			res.locals.request_id = HTTP.generateRequestId();
			next();
		});

		this.router.use('/api', appRouter);

		this.router.use('/:anyRoute', (req: Req, res: Res): void => {
			const url = `${res.locals.base_url}${req.originalUrl}`;
			HTTP.response(res, `URL not found: ${url}`, 404);
		});

		this.router.use('/', (_req: Req, res: Res): void => {
			const url = res.locals.base_url;
			HTTP.response(res, Constant.app.INDEX_MESSAGE, 200, { url });
		});
	}
}
