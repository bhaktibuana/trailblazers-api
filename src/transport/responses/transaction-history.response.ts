import { TransactionHistory } from '@/app/models';

export class TransactionHistoryResponse {
	/**
	 * List - Transaction History Response
	 *
	 * @param payload
	 * @returns
	 */
	public list(payload: TransactionHistory[] | null) {
		if (payload === null) return null;
		if (payload.length === 0) return [] as TransactionHistory[];
		return payload;
	}
}
