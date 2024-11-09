import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

import { Config } from '@/config';
import { Constant } from '@/shared/constants';
import { Console } from '@/shared/utils/console.util';

export class MySQL {
	private static mainDbConnection: Sequelize = new Sequelize(
		Config.db.MAIN_MYSQL_DB_NAME,
		Config.db.MAIN_MYSQL_DB_USER,
		Config.db.MAIN_MYSQL_DB_PASSWORD,
		{
			host: Config.db.MAIN_MYSQL_DB_HOST,
			port: Config.db.MAIN_MYSQL_DB_PORT,
			dialect: Constant.db.MYSQL_NAME,
			dialectModule: mysql2,
			logging:
				Config.app.NODE_ENV === Constant.app.ENV_PROD
					? false
					: Console.log,
		},
	);

	/**
	 * Connect to main database
	 */
	public static async connectMainDb(): Promise<void> {
		try {
			await this.mainDbConnection.authenticate();
			Console.info(
				`Successfully connected to mysql main database (${Config.db.MAIN_MYSQL_DB_NAME})`,
			);
		} catch (error) {
			Console.error(error);
			process.exit(1);
		}
	}

	/**
	 * Disconnect all connections
	 */
	public static async disconnectAll(): Promise<void> {
		await Promise.all([MySQL.mainDbConnection?.close()]);
		Console.info('All MySQL connections disconnected.');
	}

	/**
	 * Get the main database connection instance
	 *
	 * @returns
	 */
	public static getMainDbConnection(): Sequelize {
		return MySQL.mainDbConnection;
	}
}
