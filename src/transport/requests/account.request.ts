import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ConnectWalletReqBody {
	@IsString()
	@IsNotEmpty()
	@Matches(/^0x[a-fA-F0-9]{64}$/, {
		message:
			'private_key must start with 0x and contain 64 hexadecimal characters',
	})
	private_key!: string;
}
