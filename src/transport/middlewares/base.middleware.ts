import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { SystemLog } from '@/app/models';
import { AppError, HTTP } from '@/shared/utils';
import { T_AppErrorData } from '@/shared/types';
import { Constant } from '@/shared/constants';
import { Res } from '@/shared/types/express';

export abstract class BaseMiddleware {
	protected readonly STATUS_CODE = StatusCodes;

	/**
	 * Error Handler
	 *
	 * @param statusCode
	 * @param message
	 * @param errorData
	 */
	protected errorHandler(
		statusCode: StatusCodes,
		message: string,
		errorData: T_AppErrorData = null,
	): void {
		throw new AppError(
			statusCode,
			message,
			errorData,
			this.constructor.name,
		);
	}

	/**
	 * Generate HTTP Error Response
	 *
	 * @param res
	 * @param error
	 */
	protected errorResponse<T>(res: Response, error: T): void {
		HTTP.errorResponse(res, error);
	}

	/**
	 * Handle SystemLog to DB
	 *
	 * @param functionName
	 * @param data
	 * @param status
	 * @param slug
	 */
	protected async systemLog(
		res: Response,
		functionName: string,
		data: object | unknown = {},
		status: 'success' | 'failed' = 'failed',
		slug: string | null = null,
	): Promise<void> {
		const systemLog = new SystemLog();
		systemLog.payload = {
			app_name: Constant.app.APP_NAME,
			class_name: this.constructor.name,
			function_name: functionName,
			request_id: (res as Res).locals.request_id,
			slug,
			status,
			data,
		};
		await systemLog.save();
	}

	/**
	 * Middleware Catch Error Handler
	 *
	 * @param res
	 * @param error
	 * @param functionName
	 */
	protected async catchErrorHandler(
		res: Response,
		error: unknown,
		functionName: string,
	): Promise<void> {
		if (error instanceof AppError) {
			if (error.sourceError === this.constructor.name)
				await this.systemLog(res, functionName, error);
		} else {
			await this.systemLog(res, functionName, error);
		}
		this.errorResponse(res, error);
	}
}
