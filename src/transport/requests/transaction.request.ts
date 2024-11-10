import { IsIn, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

import { Constant } from '@/shared/constants';
import { T_NetworkType } from '@/shared/types';

export class CalculateGasPriceReqQuery {
	@Transform(({ value }) => {
		if (!value) return 0;
		return parseFloat(value);
	})
	@IsNumber()
	@IsNotEmpty()
	increase_percentage!: number;
}

export class RpcListReqQuery {
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
}

export class StartReqBody {
	@IsNumber()
	@IsNotEmpty()
	@Min(1, {
		message: 'transaction_count must be greater than 0',
	})
	transaction_count!: number;

	@Transform(({ value }) => {
		if (!value) return 0;
		return parseFloat(value);
	})
	@IsNumber()
	@IsNotEmpty()
	increase_gas_price_percentage!: number;
}
