import {
	IsString,
	IsNotEmpty,
	Matches,
	IsIn,
	IsOptional,
} from 'class-validator';

import { Constant } from '@/shared/constants';
import { T_NetworkType } from '@/shared/types';

export class ConnectWalletReqBody {
	@IsString()
	@IsNotEmpty()
	@Matches(/^0x[a-fA-F0-9]{64}$/, {
		message:
			'private_key must start with 0x and contain 64 hexadecimal characters',
	})
	private_key!: string;

	@IsString()
	@IsNotEmpty()
	@IsIn(
		[
			Constant.web3.NETWORK_TYPE_TESTNET,
			Constant.web3.NETWORK_TYPE_MAINNET,
		],
		{
			message: `network_type must be either ${Constant.web3.NETWORK_TYPE_TESTNET} or ${Constant.web3.NETWORK_TYPE_MAINNET}`,
		},
	)
	network_type!: T_NetworkType;

	@IsOptional()
	rpc_id: number = 1;
}
