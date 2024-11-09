import { Config } from '@/config';
import {
	I_AbiConstant,
	I_ContractAddressConstant,
	I_RpcConstant,
} from '@/shared/interfaces';
import { T_NetworkType, T_TokenName } from '@/shared/types';

export class Web3Constant {
	public readonly NETWORK_TYPE_TESTNET: T_NetworkType = 'testnet';
	public readonly NETWORK_TYPE_MAINNET: T_NetworkType = 'mainnet';

	public readonly TOKEN_ETH: T_TokenName = 'eth';
	public readonly TOKEN_WETH: T_TokenName = 'weth';

	public readonly TOKENS: T_TokenName[] = [this.TOKEN_ETH, this.TOKEN_WETH];

	public readonly RPC: I_RpcConstant = {
		testnet: [
			{
				id: 1,
				url: 'https://rpc.hekla.taiko.xyz',
			},
		],
		mainnet: [
			{
				id: 1,
				url: 'https://rpc.mainnet.taiko.xyz',
			},
			{
				id: 2,
				url: 'https://rpc.ankr.com/taiko',
			},
			{
				id: 3,
				url: 'https://rpc.taiko.xyz',
			},
			{
				id: 4,
				url: 'https://taiko-json-rpc.stakely.io',
			},
			{
				id: 5,
				url: 'https://taiko-mainnet.rpc.porters.xyz/taiko-public',
			},
			{
				id: 6,
				url: 'https://taiko-rpc.publicnode.com',
			},
		],
	};

	public readonly CA: I_ContractAddressConstant = {
		testnet: [
			{
				name: 'weth',
				contract_address: '0xae2C46ddb314B9Ba743C6dEE4878F151881333D9',
			},
		],
		mainnet: [
			{
				name: 'weth',
				contract_address: '0xA51894664A773981C6C112C43ce576f315d5b1B6',
			},
		],
	};

	public readonly ABI: I_AbiConstant = {
		testnet: [
			{
				name: 'weth',
				abi: Config.abi.TESTNET_WETH_ABI,
			},
		],
		mainnet: [
			{
				name: 'weth',
				abi: Config.abi.MAINNET_WETH_ABI,
			},
		],
	};
}
