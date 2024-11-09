import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';

import { Constant } from '@/shared/constants';
import { T_JWTPayload } from '@/shared/types';
import { Config } from '@/config';
import { I_Pagination, I_VerifiedJWT } from '@/shared/interfaces';

export class Helper {
	/**
	 * Sleep the program
	 *
	 * @param ms
	 * @returns
	 */
	public static async sleep(ms: number): Promise<unknown> {
		return await new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Hash String
	 *
	 * @param str
	 * @returns
	 */
	public static hash(str: string): string {
		return crypto
			.createHmac('sha256', Constant.app.HASH_SALT)
			.update(str)
			.digest('hex');
	}

	/**
	 * Generate JWT
	 *
	 * @param payload
	 * @param expiresIn
	 * @returns
	 */
	public static generateJWT(
		payload: T_JWTPayload,
		expiresIn?: SignOptions['expiresIn'],
	): string {
		return expiresIn
			? jwt.sign(payload, Config.app.JWT_SECRET_KEY, {
					algorithm: 'HS256',
					expiresIn,
				} as SignOptions)
			: jwt.sign(payload, Config.app.JWT_SECRET_KEY, {
					algorithm: 'HS256',
				} as SignOptions);
	}

	/**
	 * Verify JWT
	 *
	 * @param token
	 * @returns
	 */
	public static verifyJWT<T>(token: string): I_VerifiedJWT<T> {
		let error: I_VerifiedJWT<T>['error'] = null;
		let decoded: I_VerifiedJWT<T>['decoded'] = {};

		jwt.verify(
			token,
			Config.app.JWT_SECRET_KEY,
			{ algorithms: ['HS256'] },
			(err, dec) => {
				error = err;
				decoded = dec as I_VerifiedJWT<T>['decoded'];
			},
		);
		return { error, decoded };
	}

	/**
	 * Generate Pagination
	 *
	 * @param page
	 * @param perPage
	 * @param count
	 * @returns
	 */
	public static generatePagination(
		page: number,
		perPage: number,
		count: number,
	): I_Pagination | null {
		const totalPage = count > 0 ? Math.ceil(count / perPage) : 0;
		const previousPage = page - 1 <= 0 ? null : page - 1;
		const nextPage = page + 1 > totalPage ? null : page + 1;

		return {
			current_page: page,
			previous_page: previousPage,
			next_page: nextPage,
			per_page: perPage,
			total_pages: totalPage,
			total_items: count,
		} as I_Pagination;
	}
}
