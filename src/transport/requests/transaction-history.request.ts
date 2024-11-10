import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import dayjs from 'dayjs';

import {
	T_SortType,
	T_TransactionHistoryMethod,
	T_TransactionHistoryStatus,
	T_TxHistoryIndexSortBy,
} from '@/shared/types';

export class ListReqQuery {
	@IsString()
	transaction_hash!: string;

	@IsString()
	method!: T_TransactionHistoryMethod;

	@IsString()
	status!: T_TransactionHistoryStatus;

	@IsOptional()
	@Transform(({ value }) =>
		value ? dayjs(value).startOf('day').toDate() : undefined,
	)
	start_date!: Date;

	@IsOptional()
	@Transform(({ value }) =>
		value ? dayjs(value).endOf('day').toDate() : undefined,
	)
	end_date!: Date;

	@Transform(({ value }: { value: T_TxHistoryIndexSortBy }) => {
		if (
			value === 'finished_at' ||
			value === 'transaction_fee' ||
			value === 'amout'
		) {
			return value;
		} else return 'created_at';
	})
	@IsString()
	sort_by!: T_TxHistoryIndexSortBy;

	@Transform(({ value }: { value: T_SortType }) =>
		value === 'asc' ? value : 'desc',
	)
	@IsString()
	sort!: T_SortType;

	@Transform(({ value }) => {
		const val = Number(value);
		if (val) {
			return val < 1 ? 1 : val;
		} else {
			return 1;
		}
	})
	@IsNumber()
	page!: number;

	@Transform(({ value }) => {
		const val = Number(value);
		if (val) {
			return val < 1 ? 1 : val;
		} else {
			return 10;
		}
	})
	@IsNumber()
	per_page!: number;
}
