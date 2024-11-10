import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { SystemLog } from '@/app/models';
import { AppError, HTTP } from '@/shared/utils';
import { T_AppErrorData, T_Pagination } from '@/shared/types';
import { Res } from '@/shared/types/express';
import { Constant } from '@/shared/constants';

export abstract class Controller {
	protected readonly STATUS_CODE = StatusCodes;

	/**
	 * Get Express Response locals
	 *
	 * @param res
	 * @returns
	 */
	protected getLocals(res: Response): Res['locals'] {
		return (res as Res).locals;
	}

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
	 * Get Base Request Object
	 *
	 * @param dtoClass
	 * @param req
	 * @returns
	 */
	private async getRequestObject<T>(
		dtoClass: ClassConstructor<T>,
		req: Request['body'] | Request['query'] | Request['params'],
	) {
		const reqObject = plainToInstance(dtoClass, req);
		const errors = await validate(reqObject as object);

		if (errors.length > 0)
			this.errorHandler(400, 'Validation failed', errors);

		return reqObject;
	}

	/**
	 * Get Request Body
	 *
	 * @param dtoClass
	 * @param req
	 * @returns
	 */
	protected async getRequestBody<T>(
		dtoClass: ClassConstructor<T>,
		req: Request,
	) {
		return await this.getRequestObject(dtoClass, req.body);
	}

	/**
	 * Get Request Path Query
	 *
	 * @param dtoClass
	 * @param req
	 * @returns
	 */
	protected async getRequestQuery<T>(
		dtoClass: ClassConstructor<T>,
		req: Request,
	) {
		return await this.getRequestObject(dtoClass, req.query);
	}

	/**
	 * Get Request Path Params
	 *
	 * @param dtoClass
	 * @param req
	 * @returns
	 */
	protected async getRequestParams<T>(
		dtoClass: ClassConstructor<T>,
		req: Request,
	) {
		return await this.getRequestObject(dtoClass, req.params);
	}

	/**
	 * Generate HTTP Response
	 *
	 * @param res
	 * @param message
	 * @param statusCode
	 * @param data
	 */
	protected response<T>(
		res: Response,
		message: string,
		statusCode: StatusCodes,
		data: T | null = null,
	): void {
		HTTP.response(res, message, statusCode, data);
	}

	/**
	 * Generate HTTP Response Pagination
	 *
	 * @param res
	 * @param message
	 * @param statusCode
	 * @param data
	 * @param pagination
	 */
	protected responsePagination<T>(
		res: Response,
		message: string,
		statusCode: StatusCodes,
		data: T | null = null,
		pagination: T_Pagination = null,
	): void {
		HTTP.response(res, message, statusCode, data, pagination);
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
	 * @param res
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
	 * Controller Catch Error Handler
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
