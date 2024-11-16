import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import axios, {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios';

import { AppError } from '@/shared/utils';
import { SystemLog } from '@/app/models';
import { Constant } from '@/shared/constants';
import { Res } from '@/shared/types/express';
import { T_AppErrorData } from '@/shared/types';

export abstract class Api {
	private api: AxiosInstance;
	protected readonly STATUS_CODE = StatusCodes;

	constructor(baseURL: string, timeout: number = 30000) {
		this.api = axios.create({
			baseURL,
			timeout,
		});

		this.initializeInterceptors();
	}

	/**
	 * Init Axios Interceptors
	 */
	private initializeInterceptors() {
		this.api.interceptors.request.use(this.handleRequest, this.handleError);

		this.api.interceptors.response.use(
			this.handleResponse,
			this.handleError,
		);
	}

	/**
	 * Handle Axios Request
	 *
	 * @param config
	 * @returns
	 */
	private handleRequest(
		config: InternalAxiosRequestConfig,
	): InternalAxiosRequestConfig {
		return config;
	}

	/**
	 * Handle Axios Response
	 *
	 * @param response
	 * @returns
	 */
	private handleResponse(response: AxiosResponse): AxiosResponse {
		return response;
	}

	/**
	 * Hanlde Axios Error
	 * @param error
	 * @returns
	 */
	private handleError(error: any) {
		return Promise.reject(error);
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
	 */
	protected async catchErrorHandler(
		res: Response | null,
		error: unknown,
		functionName: string,
	): Promise<void> {
		await this.systemLog(res, functionName, error);
	}

	/**
	 * Axios GET method
	 *
	 * @param url
	 * @param config
	 * @returns
	 */
	protected async get<T>(
		url: string,
		config?: AxiosRequestConfig,
	): Promise<T | null> {
		let result: T | null = null;

		try {
			const response = await this.api.get<T>(url, config);
			result = response.data;
		} catch (error) {
			const err = error as never as AxiosError;
			const errPayload = {
				stack: err.stack,
				message: err.message,
				statusCode: err.response?.status,
				errorData: err.response?.data,
				sourceError: this.constructor.name,
				name: err.name,
			};
			await this.catchErrorHandler(null, errPayload, this.get.name);
		}
		return result;
	}

	/**
	 * Axios POST method
	 *
	 * @param url
	 * @param config
	 * @returns
	 */
	protected async post<T>(
		url: string,
		data: any,
		config?: AxiosRequestConfig,
	): Promise<T | null> {
		let result: T | null = null;

		try {
			const response = await this.api.post<T>(url, data, config);
			result = response.data;
		} catch (error) {
			const err = error as never as AxiosError;
			const errPayload = {
				stack: err.stack,
				message: err.message,
				statusCode: err.response?.status,
				errorData: err.response?.data,
				sourceError: this.constructor.name,
				name: err.name,
			};
			await this.catchErrorHandler(null, errPayload, this.post.name);
		}
		return result;
	}

	/**
	 * Axios PUT method
	 *
	 * @param url
	 * @param config
	 * @returns
	 */
	protected async put<T>(
		url: string,
		data: any,
		config?: AxiosRequestConfig,
	): Promise<T | null> {
		let result: T | null = null;

		try {
			const response = await this.api.put<T>(url, data, config);
			result = response.data;
		} catch (error) {
			const err = error as never as AxiosError;
			const errPayload = {
				stack: err.stack,
				message: err.message,
				statusCode: err.response?.status,
				errorData: err.response?.data,
				sourceError: this.constructor.name,
				name: err.name,
			};
			await this.catchErrorHandler(null, errPayload, this.put.name);
		}
		return result;
	}

	/**
	 * Axios DELETE method
	 *
	 * @param url
	 * @param config
	 * @returns
	 */
	protected async delete<T>(
		url: string,
		config?: AxiosRequestConfig,
	): Promise<T | null> {
		let result: T | null = null;

		try {
			const response = await this.api.delete<T>(url, config);
			result = response.data;
		} catch (error) {
			const err = error as never as AxiosError;
			const errPayload = {
				stack: err.stack,
				message: err.message,
				statusCode: err.response?.status,
				errorData: err.response?.data,
				sourceError: this.constructor.name,
				name: err.name,
			};
			await this.catchErrorHandler(null, errPayload, this.delete.name);
		}
		return result;
	}
}
