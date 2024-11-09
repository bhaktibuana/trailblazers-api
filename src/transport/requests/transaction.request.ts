import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CalculateGasPriceReqQuery {
	@Transform(({ value }) => {
		if (!value) return 0;
		return parseFloat(value);
	})
	@IsNumber()
	@IsNotEmpty()
	increase_percentage!: number;
}
