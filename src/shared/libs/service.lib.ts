import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { SystemLog } from '@/app/models';
import { AppError } from '@/shared/utils';
import { T_AppErrorData } from '@/shared/types';
import { Constant } from '@/shared/constants';
import { Res } from '@/shared/types/express';

export abstract class Service {
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
	 * Handle SystemLog to DB
	 *
	 * @param res
	 * @param functionName
	 * @param data
	 * @param status
	 * @param slug
	 */
	protected async systemLog(
		res: Response | null,
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
			slug,
			status,
			data,
		};

		if (res) {
			systemLog.payload.request_id = (res as Res).locals.request_id;
		}

		await systemLog.save();
	}

	/**
	 * Service Catch Error Handler
	 *
	 * @param res
	 * @param error
	 * @param functionName
	 * @param throwAppError
	 */
	protected async catchErrorHandler(
		res: Response | null,
		error: unknown,
		functionName: string,
		throwAppError: boolean = true,
	): Promise<void> {
		if (error instanceof AppError) {
			if (error.sourceError === this.constructor.name) {
				await this.systemLog(res, functionName, error);
				if (throwAppError) {
					this.errorHandler(error.statusCode, error.message, error);
				}
			}
		} else {
			await this.systemLog(res, functionName, error);
		}

		if (throwAppError) {
			const errorMessage =
				(error as { message: string }).message ||
				'Internal Server Error';
			this.errorHandler(
				this.STATUS_CODE.INTERNAL_SERVER_ERROR,
				errorMessage,
				error,
			);
		}
	}
}
