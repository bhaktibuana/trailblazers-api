import Web3Js, { Numbers, Web3BaseProvider } from 'web3';
import { RegisteredSubscription } from 'web3/lib/commonjs/eth.exports';

import { T_NetworkType, T_TokenName } from '@/shared/types';
import { I_BalanceResult, I_RpcData } from '@/shared/interfaces';
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

	/**
	 * Get account balance by token name
	 *
	 * @param address
	 * @param tokenName
	 * @returns
	 */
	public async getBalance(
		address: string,
		tokenName: T_TokenName,
	): Promise<I_BalanceResult | null> {
		let result: I_BalanceResult | null;
		let balanceWei: Numbers;
		let balanceEther: string;

		try {
			const web3 = this.web3 as Web3Js<RegisteredSubscription>;

			if (tokenName === 'eth') {
				balanceWei = await web3.eth.getBalance(address);
			} else {
				const abi = Helper.getAbi(this.networkType, tokenName);
				const contractAddress = Helper.getContractAddress(
					this.networkType,
					tokenName,
				);

				if (!abi) return null;
				if (!contractAddress) return null;

				const contract = new web3.eth.Contract(
					abi.abi,
					contractAddress.contract_address,
				);

				balanceWei = (await contract.methods
					.balanceOf(address)
					.call()) as Numbers;
			}

			balanceEther = web3.utils.fromWei(balanceWei, 'ether');

			result = {
				token: tokenName,
				amount: balanceEther,
				amount_wei: BigInt(balanceWei).toString(),
			} as I_BalanceResult;
		} catch (error) {
			result = null;
		}

		return result;
	}

	/**
	 * Get gas price
	 *
	 * @param increasePercentage
	 * @returns
	 */
	public async getGasPrice(increasePercentage: number) {
		let result = null;

		const baseMultiplier = 100;
		const baseDivider = 100;

		try {
			const web3 = this.web3 as Web3Js<RegisteredSubscription>;

			const gasPrice = BigInt(await web3.eth.getGasPrice());
			const increasedGasPrice =
				(gasPrice * BigInt(baseMultiplier + increasePercentage)) /
				BigInt(baseDivider);
			const gasPriceHex = web3.utils.toHex(increasedGasPrice);

			result = {
				base_gas_price: gasPrice,
				increased_gas_price: increasedGasPrice,
				gas_price_hex: gasPriceHex,
			};
		} catch (error) {
			result = null;
		}

		return result;
	}
}
