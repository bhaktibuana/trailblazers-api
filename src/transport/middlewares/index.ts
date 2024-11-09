import { BaseMiddleware } from '@/transport/middlewares/base.middleware';
import { Next, Req, Res } from '@/shared/types/express';

export class Middleware extends BaseMiddleware {
	constructor() {
		super();
	}

	public async example(_req: Req, _res: Res, next: Next): Promise<void> {
		try {
			next();
		} catch (error) {
			await this.catchErrorHandler(res, error, this.example.name);
		}
	}
}
