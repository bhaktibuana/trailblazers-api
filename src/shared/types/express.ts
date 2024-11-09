import { NextFunction, Request, Response } from 'express';

declare namespace e {
	type Next = NextFunction;
	type Req = Request;

	type Res = Response<
		any,
		{
			base_url: string;
			request_id: string;
		}
	>;
}

export = e;
