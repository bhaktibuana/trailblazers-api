import { Cron } from '@/shared/libs/cron.lib';
import { RiceparkApi } from '@/app/apis';
import { I_RiceparkRefreshReqParams } from '@/shared/interfaces';
import { Config } from '@/config';
import { Constant } from '@/shared/constants';

export class RiceparkCron extends Cron {
	private riceparkApi: RiceparkApi;

	constructor() {
		super();

		this.riceparkApi = new RiceparkApi();
	}

	/**
	 * Refresh point of ricepark every 46 minutes
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
}
