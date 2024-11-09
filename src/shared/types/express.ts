import { NextFunction, Request, Response } from 'express';

import { I_Account } from '@/shared/interfaces';

declare namespace e {
	type Next = NextFunction;
	type Req = Request;

	type Res = Response<
		any,
		{
			base_url: string;
			request_id: string;
			account: I_Account
		}
	>;
}

export = e;
