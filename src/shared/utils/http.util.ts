import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { AppError } from '@/shared/utils/app-error.util';
import { Console } from '@/shared/utils/console.util';
import { I_HTTPResponse } from '@/shared/interfaces';
import { T_Pagination } from '@/shared/types';
import { Res } from '@/shared/types/express';

export class HTTP {
	/**
	 * Generate HTTP request id
	 *
	 * @returns
	 */
	public static generateRequestId(): string {
		return uuidv4();
	}

	/**
	 * HTTP Response
	 *
	 * @param res
	 * @param message
	 * @param statusCode
	 * @param data
	 * @param pagination
	 */
	public static response<T>(
		res: Response,
		message: string,
		statusCode: number,
		data: T | null = null,
		pagination: T_Pagination = null,
	): void {
		const resp = res as Res;
		resp.status(statusCode).json({
			request_id: resp.locals.request_id || '',
			message,
			status: statusCode >= 200 && statusCode < 300,
			status_code: statusCode,
			data,
			error: null,
			pagination,
		} as I_HTTPResponse<T>);
	}

	/**
	 * Base HTTP Error Response
	 *
	 * @param res
	 * @param message
	 * @param statusCode
	 * @param error
	 */
	private static baseErrorResponse<T>(
		res: Response,
		message: string,
		statusCode: number,
		error: T | null = null,
	): void {
		const resp = res as Res;
		resp.status(statusCode).json({
			request_id: resp.locals.request_id || '',
			message,
			status: statusCode >= 200 && statusCode < 300,
			status_code: statusCode,
			data: null,
			error,
			pagination: null,
		} as I_HTTPResponse<T>);
	}

	/**
	 * HTTP Error Response
	 *
	 * @param res
	 * @param error
	 */
	public static errorResponse<T>(res: Response, error: T): void {
		if (error instanceof AppError) {
			const err = error.errorData ? error.errorData : error.stack;
			HTTP.baseErrorResponse(res, error.message, error.statusCode, err);
		} else {
			const errorMessage = 'Internal Server Error';
			Console.error(`${errorMessage} - ${error}`);
			HTTP.baseErrorResponse(res, errorMessage, 500, error);
		}
	}
}
