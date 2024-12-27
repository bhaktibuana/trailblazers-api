import { Constant } from '@/shared/constants';
import { I_NotPxGetUserResponse } from '@/shared/interfaces';
import { Api } from '@/shared/libs/api.lib';

export class NotPxApi extends Api {
	constructor() {
		super(Constant.notPX.API_BASE_URL);
	}

	/**
	 * Not Pixel Get User
	 *
	 * @param reqParams
	 * @returns
	 */
	public async getUser(reqQuery: {
		limit: string;
		offset: string;
	}): Promise<I_NotPxGetUserResponse | null> {
		const path = '/api/v1/ratings/personal';
		let result: I_NotPxGetUserResponse | null = null;

		const params: { league: string; limit: string; offset: string } = {
			...reqQuery,
			league: 'platinum',
		};

		const headers = {
			Accept: 'application/json, text/plain, */*',
			Authorization:
				'initData user=%7B%22id%22%3A1216409447%2C%22first_name%22%3A%22Shin%22%2C%22last_name%22%3A%22Derra%22%2C%22username%22%3A%22Derra_21%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F9rA49HOfIlWv296Zj2cSuOoy2bFhh76dEY2hmr7Cuzk.svg%22%7D&chat_instance=3715928479357593765&chat_type=sender&auth_date=1735216788&signature=JXd61J6ToRjUITPviBm4vTiWoNiaviE1QkL-BRFSVzgaQ26BOi4JLevHiwV_yBzH8axe0kgwoTxgnBs_4dhMCw&hash=1b04cbdda28097f2df1848d83f9db69fe9251fe4be7e887854c2dac47c9be666',
			'Sec-Fetch-Site': 'same-origin',
			'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
			'Accept-Encoding': 'gzip, deflate, br',
			'Sec-Fetch-Mode': 'cors',
			Host: 'notpx.app',
			'User-Agent':
				'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
			Connection: 'keep-alive',
			Referer: 'https://notpx.app/ratings',
			Cookie: '__cf_bm=n.k_HvKSOFCcj9wUrcA77kpZ0K8lkE4bvfaOukH3GsA-1735216789-1.0.1.1-8MFQPfLFpFcP1pTQdxG4dvPBniVvKsVq6GhX0tzftpgZEE6x9vOmVs49jy63sbWI.cgPpIbLrebzZW_XbvhQDw; __cf_bm=I_QirFclVNmM.SubQujvIh70RWcrab2ov8zCNyoaEpo-1735216851-1.0.1.1-MIBXA7fiXu0kqURuPe.ucOtg9MFAwHrsT7eCwemKNl_g0jYckL5k9.MA6hG5SPa6rxtFLe5k7lcs9UsQZNNBTw',
			'Sec-Fetch-Dest': 'empty',
		};

		try {
			result = await this.get(path, { params, headers });
		} catch (error) {
			await this.catchErrorHandler(null, error, this.getUser.name);
		}
		return result;
	}
}
