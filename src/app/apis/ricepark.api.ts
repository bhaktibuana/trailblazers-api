import { Constant } from '@/shared/constants';
import {
	I_RiceparkRefreshReqParams,
	I_RiceparkRefreshResponse,
} from '@/shared/interfaces';
import { Api } from '@/shared/libs/api.lib';

export class RiceparkApi extends Api {
	constructor() {
		super(Constant.ricepark.API_BASE_URL);
	}

	/**
	 * Ricepark Refresh Point
	 *
	 * @param reqParams
	 * @returns
	 */
	public async refresh(
		reqParams: I_RiceparkRefreshReqParams,
	): Promise<I_RiceparkRefreshResponse | null> {
		const path = '/tomarket-game/v1/user/login';
		let result: I_RiceparkRefreshResponse | null = null;

		const params = {
			format: 'json',
			method: 'users.refreshPoints',
			...reqParams,
		};

		const headers = {
			'sec-ch-ua-platform': '"Windows"',
			Referer: 'https://www.ricepark.co/',
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
			Accept: '*/*',
			'sec-ch-ua':
				'"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
			'sec-ch-ua-mobile': '?0',
		};

		try {
			result = await this.post<I_RiceparkRefreshResponse>(
				path,
				{},
				{
					params,
					headers,
				},
			);
		} catch (error) {
			await this.catchErrorHandler(null, error, this.refresh.name);
		}
		return result;
	}
}
