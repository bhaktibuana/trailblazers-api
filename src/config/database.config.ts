import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export class DatabaseConfig {
	public readonly MAIN_MYSQL_DB_HOST = process.env.MAIN_MYSQL_DB_HOST || '';
	public readonly MAIN_MYSQL_DB_USER = process.env.MAIN_MYSQL_DB_USER || '';
	public readonly MAIN_MYSQL_DB_PASSWORD =
		process.env.MAIN_MYSQL_DB_PASSWORD || '';
	public readonly MAIN_MYSQL_DB_NAME = process.env.MAIN_MYSQL_DB_NAME || '';
	public readonly MAIN_MYSQL_DB_PORT = parseInt(
		process.env.MAIN_MYSQL_DB_PORT || '',
	);
	public readonly UTILITY_MONGO_DB_DSN =
		process.env.UTILITY_MONGO_DB_DSN || '';
	public readonly UTILITY_MONGO_DB_NAME =
		process.env.UTILITY_MONGO_DB_NAME || '';
}
