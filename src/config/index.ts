import { config as dotenvConfig } from 'dotenv';

import { AppConfig } from '@/config/app.config';
import { DatabaseConfig } from '@/config/database.config';

dotenvConfig();

export class Config {
	public static app = new AppConfig();
	public static db = new DatabaseConfig();
}
