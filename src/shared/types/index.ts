import {
	I_BalanceResult,
	I_GetBalanceSvcResult,
	I_Pagination,
} from '@/shared/interfaces';

export type T_Console = 'log' | 'info' | 'warning' | 'error';

export type T_AppErrorData =
	| Object
	| Array<Object | string | number | boolean | null>
	| null
	| unknown;

export type T_Pagination = I_Pagination | null;

export type T_JWTPayload = string | Buffer | object;

export type T_NetworkType = 'testnet' | 'mainnet';

export type T_TokenName = 'eth' | 'weth';

export type T_GetBalanceSvcResult = I_GetBalanceSvcResult & {
	[key in T_TokenName]: I_BalanceResult;
};

export type T_TransactionStatus = 'ongoing' | 'stopped';

export type T_TransactionHistoryMethod = 'wrap' | 'unwrap';

export type T_TransactionHistoryStatus = 'pending' | 'reverted' | 'completed';

export type T_SortType = 'asc' | 'desc';

export type T_TxHistoryIndexSortBy =
	| 'created_at'
	| 'amout'
	| 'transaction_fee'
	| 'finished_at';
