import dayjs from 'dayjs';
import chalk from 'chalk';

import { Config } from '@/config';
import { Constant } from '@/shared/constants';
import { T_Console } from '@/shared/types';

export class Console {
	/**
	 * App Log
	 *
	 * @param payload
	 */
	public static log<T>(payload: T): void {
		Console.console<T>('log', payload);
	}

	/**
	 * App Info
	 *
	 * @param payload
	 */
	public static info<T>(payload: T): void {
		Console.console<T>('info', payload);
	}

	/**
	 * App Warning
	 *
	 * @param payload
	 */
	public static warn<T>(payload: T): void {
		Console.console<T>('warning', payload);
	}

	/**
	 * App Log Error
	 *
	 * @param payload
	 */
	public static error<T>(payload: T): void {
		Console.console<T>('error', payload);
	}

	/**
	 * Console
	 *
	 * @param type
	 * @param payload
	 */
	private static console<T>(type: T_Console, payload: T): void {
		if (Config.app.NODE_ENV === Constant.app.ENV_PROD) return;

		let title = 'LOG';
		let titleColor = chalk.blueBright;
		const dateColor = chalk.blackBright.bold;
		const date = dayjs().format('HH:mm:ss');

		if (type === 'log') {
			title = 'LOG';
			titleColor = chalk.blue;
		} else if (type === 'info') {
			title = 'INFO';
			titleColor = chalk.blue;
		} else if (type === 'warning') {
			title = 'WARNING';
			titleColor = chalk.yellow;
		} else if (type === 'error') {
			title = 'ERROR';
			titleColor = chalk.red;
		}

		console.log(`[${titleColor(title)}] ${dateColor(date)} -`, payload);
	}
}
