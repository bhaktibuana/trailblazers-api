import { Cron } from '@/shared/libs/cron.lib';
import { RiceparkApi } from '@/app/apis';
import {
	I_RiceparkRefreshReqParams,
	I_RiceparkRichesWheelReqParams,
} from '@/shared/interfaces';
import { Config } from '@/config';
import { Constant } from '@/shared/constants';

export class RiceparkCron extends Cron {
	private riceparkApi: RiceparkApi;

	constructor() {
		super();

		this.riceparkApi = new RiceparkApi();
	}

	/**
	 * Refresh point of ricepark
	 */
	public refresh() {
		const task = async () => {
			if (Config.app.NODE_ENV === Constant.app.ENV_PROD) {
				const reqParams: I_RiceparkRefreshReqParams = {
					uid: '1766b6a25ce044dab8af9e17bed51ac4',
					tt_sig: 'bad57edf53b9eca2e76e9b00352a99a3',
				};
				await this.riceparkApi.refresh(reqParams);
			}
		};

		task();

		// execute function every 91 minutes
		setInterval(task, 91 * 60 * 1000);
	}

	/**
	 * Rice to Riches Wheel
	 */
	public richesWheel() {
		const task = async () => {
			if (Config.app.NODE_ENV === Constant.app.ENV_PROD) {
				const reqParams: I_RiceparkRichesWheelReqParams = {
					uid: '1766b6a25ce044dab8af9e17bed51ac4',
					tt_sig: 'c6a677fa97cc16ba81f9926a7644a71d',
				};
				await this.riceparkApi.richesWheel(reqParams);
			}
		};

		task();

		// execute function every 24 hours 1 minute
		setInterval(task, 1441 * 60 * 1000);
	}
}
