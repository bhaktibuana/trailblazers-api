import Web3Js, { Web3BaseProvider } from 'web3';
import { RegisteredSubscription } from 'web3/lib/commonjs/eth.exports';

import { T_NetworkType } from '@/shared/types';
import { I_RpcData } from '@/shared/interfaces';
import { Helper } from '@/shared/helpers';

export class Web3 {
	private web3Provider: Web3BaseProvider | null;

	public networkType: T_NetworkType;
	public rpc: I_RpcData | null;
	public web3: Web3Js<RegisteredSubscription> | null;

	constructor(networkType: T_NetworkType, rpcId: number = 1) {
		this.networkType = networkType;

		this.rpc = Helper.getRpc(this.networkType, rpcId);

		if (this.rpc) {
			this.web3Provider = new Web3Js.providers.HttpProvider(
				this.rpc.url as string,
			);
		} else {
			this.web3Provider = null;
		}

		if (this.web3Provider) {
			this.web3 = new Web3Js(this.web3Provider);
		} else {
			this.web3 = null;
		}
	}

	/**
	 * Connect account by private key
	 *
	 * @param privateKey
	 * @returns
	 */
	public connect(privateKey: string) {
		const web3 = this.web3 as Web3Js<RegisteredSubscription>;
		return web3.eth.accounts.privateKeyToAccount(privateKey);
	}
}
