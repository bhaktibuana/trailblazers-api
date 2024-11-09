import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';

import { Constant } from '@/shared/constants';
import { T_JWTPayload, T_NetworkType, T_TokenName } from '@/shared/types';
import { Config } from '@/config';
import {
	I_AbiData,
	I_ContractAddressData,
	I_Pagination,
	I_RpcData,
	I_VerifiedJWT,
} from '@/shared/interfaces';

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

	/**
	 * Get RPC Data
	 *
	 * @param networkType
	 * @param rpcId
	 * @returns
	 */
	public static getRpc(
		networkType: T_NetworkType,
		rpcId: number = 1,
	): I_RpcData | null {
		const rpc = Constant.web3.RPC[networkType].find(
			(rpc) => rpc.id === rpcId,
		);

		if (!rpc) return null;
		return rpc;
	}

	/**
	 * Get Contract Address Data
	 *
	 * @param networkType
	 * @param tokenName
	 * @returns
	 */
	public static getContractAddress(
		networkType: T_NetworkType,
		tokenName: T_TokenName,
	): I_ContractAddressData | null {
		const ca = Constant.web3.CA[networkType].find(
			(ca) => ca.name === tokenName,
		);

		if (!ca) return null;
		return ca;
	}

	/**
	 * Get ABI Data
	 *
	 * @param networkType
	 * @param tokenName
	 * @returns
	 */
	public static getAbi(
		networkType: T_NetworkType,
		tokenName: T_TokenName,
	): I_AbiData | null {
		const abi = Constant.web3.ABI[networkType].find(
			(abi) => abi.name === tokenName,
		);

		if (!abi) return null;
		return abi;
	}
}
