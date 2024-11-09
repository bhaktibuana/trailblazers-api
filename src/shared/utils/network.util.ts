import os from 'os';

export class Network {
	/**
	 * Get local IP address
	 *
	 * @returns
	 */
	public static getLocalIp(): string {
		const networkInterfaces = os.networkInterfaces();

		for (const interfaceName in networkInterfaces) {
			const interfaceInfo = networkInterfaces[interfaceName];

			if (interfaceInfo) {
				for (const network of interfaceInfo) {
					// Only look for IPv4 and ensure it's not an internal (localhost) address
					if (network.family === 'IPv4' && !network.internal) {
						return network.address;
					}
				}
			}
		}

		return '127.0.0.1';
	}
}
