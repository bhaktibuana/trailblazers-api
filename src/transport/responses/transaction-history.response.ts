import { TransactionHistory } from '@/app/models';
import { I_TxHistoryScoreboardResult } from '@/shared/interfaces';

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

	/**
	 * Scoreboard - Transaction History Response
	 *
	 * @param payload
	 * @returns
	 */
	public scoreboard(payload: I_TxHistoryScoreboardResult[]) {
		if (payload.length === 0) return null;
		return {
			completed_tx_count: payload[0].completed_tx_count,
			pending_tx_count: payload[0].pending_tx_count,
			reverted_tx_count: payload[0].reverted_tx_count,
			wrap_count: payload[0].wrap_count,
			unwrap_count: payload[0].unwrap_count,
			total_eth_swap: payload[0].total_eth_swap,
			avg_eth_swap: payload[0].avg_eth_swap,
			total_tx_fee: payload[0].total_tx_fee,
			avg_tx_fee: payload[0].avg_tx_fee,
		};
	}
}
