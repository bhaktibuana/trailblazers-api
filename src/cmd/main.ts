import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';

import { Config } from '@/config';
import { Console, Mongo, MySQL, Network } from '@/shared/utils';
import { Routers } from '@/transport/routers';
import { Associate } from '@/app/models/associate';
import { TransactionCron, RiceparkCron } from '@/app/crons';

class Main {
	private app: Express;

	constructor() {
		this.app = express();

		this.init();
		this.middlewares();
		this.routes();
		this.listenServer();
		this.background();
	}

	/**
	 * App Init
	 */
	private async init(): Promise<void> {
		// connect main database (mysql)
		await MySQL.connectMainDb();

		// connect utility database (mongo)
		await Mongo.connectUtilityDb(
			Config.db.UTILITY_MONGO_DB_DSN,
			Config.db.UTILITY_MONGO_DB_NAME,
		);

		// init mysql association
		new Associate();
	}

	/**
	 * App Middlewares
	 */
	private middlewares(): void {
		this.app.enable('trust proxy');
		this.app.use(helmet({ crossOriginEmbedderPolicy: false }));
		this.app.use(cors({ origin: '*' }));
		this.app.use(express.json());
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
	}

	/**
	 * App Routes
	 */
	private routes(): void {
		const routers = new Routers().router;
		this.app.use('/', routers);
	}

	/**
	 * App Listen Server
	 */
	private listenServer(): void {
		const port = Config.app.PORT;
		const localIp = Network.getLocalIp();

		this.app.listen(port, () => {
			Console.info('App is running');
			Console.info(`Environment : ${Config.app.NODE_ENV}`);
			Console.info(`Local       : http://localhost:${port}`);
			Console.info(`Network     : http://${localIp}:${port}`);
			Console.info(`HTTP url    : ${Config.app.BASE_URL}\n`);
		});
	}

	/**
	 * App Background
	 */
	private background(): void {
		// start transaction scheduler
		const transactionCron = new TransactionCron();
		transactionCron.stopOngoingTnx(1);
		// end transaction scheduler

		// start ricepark scheduler
		const riceparkCron = new RiceparkCron();
		riceparkCron.refresh();
		riceparkCron.richesWheel();
		// end ricepark scheduler
	}
}

new Main();
