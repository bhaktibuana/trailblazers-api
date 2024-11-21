import {
	T_TransactionHistoryMethod,
	T_TransactionHistoryStatus,
	T_TransactionStatus,
} from '@/shared/types';

export class TransactionConstant {
	public readonly TRANSACTION_STATUS_ONGOING: T_TransactionStatus = 'ongoing';
	public readonly TRANSACTION_STATUS_STOPPED: T_TransactionStatus = 'stopped';

	public readonly TRANSACTION_HISTORY_METHOD_WRAP: T_TransactionHistoryMethod =
		'wrap';
	public readonly TRANSACTION_HISTORY_METHOD_UNWRAP: T_TransactionHistoryMethod =
		'unwrap';

	public readonly TRANSACTION_HISTORY_STATUS_PENDING: T_TransactionHistoryStatus =
		'pending';
	public readonly TRANSACTION_HISTORY_STATUS_REVERTED: T_TransactionHistoryStatus =
		'reverted';
	public readonly TRANSACTION_HISTORY_STATUS_COMPLETED: T_TransactionHistoryStatus =
		'completed';

	public readonly MIN_BALANCE_ETH = '0.0001';
}
