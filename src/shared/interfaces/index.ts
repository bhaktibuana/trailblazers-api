import { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { ContractAbi } from 'web3';

import {
	T_NetworkType,
	T_SortType,
	T_TokenName,
	T_TransactionHistoryMethod,
	T_TransactionHistoryStatus,
	T_TxHistoryIndexSortBy,
} from '@/shared/types';

export interface I_Pagination {
	total_items?: number;
	total_pages?: number;
	per_page?: number;
	current_page?: number;
	next_page?: number | null;
	previous_page?: number | null;
}

export interface I_HTTPResponse<T> {
	request_id: string;
	message: string;
	status: boolean;
	status_code: number;
	data: T | null;
	error: T | null;
	pagination: I_Pagination | null;
}

export interface I_VerifiedJWT<T> {
	error: VerifyErrors | null;
	decoded: (JwtPayload & T) | Object;
}

export interface I_ModelWithAssociate {
	associate?: () => void;
}

export interface I_RpcData {
	id: number;
	url: string;
}

export interface I_RpcConstant {
	testnet: I_RpcData[];
	mainnet: I_RpcData[];
}

export interface I_ContractAddressData {
	name: T_TokenName;
	contract_address: string;
}

export interface I_ContractAddressConstant {
	testnet: I_ContractAddressData[];
	mainnet: I_ContractAddressData[];
}

export interface I_Account {
	address: string;
	private_key: string;
	network_type: T_NetworkType;
	rpc_id: number;
}

export interface I_AbiData {
	name: T_TokenName;
	abi: ContractAbi;
}

export interface I_AbiConstant {
	testnet: I_AbiData[];
	mainnet: I_AbiData[];
}

export interface I_BalanceResult {
	token: T_TokenName;
	amount: string;
	amount_wei: string;
}

export interface I_GetBalanceSvcResult {
	address: string;
	network_type: T_NetworkType;
}

export interface I_CalculateGasPriceSvcResult {
	network_type: T_NetworkType;
	base_gas_price: string;
	increased_gas_price: string;
}

export interface I_RpcLatency {
	is_online: boolean;
	latency: number | string;
}

export interface I_RpcListSvcResult {
	network_type: T_NetworkType;
	rpc_list: (I_RpcData & I_RpcLatency)[];
}

export interface I_StartSvcResult {
	network_type: T_NetworkType;
	address: string;
	start_at: Date;
}

export interface I_TxHistoryListQueryPayload {
	transaction_hash: string;
	method: T_TransactionHistoryMethod;
	status: T_TransactionHistoryStatus;
	start_date: Date;
	end_date: Date;
	sort_by: T_TxHistoryIndexSortBy;
	sort: T_SortType;
	page: number;
	per_page: number;
	address: string;
	network_type: T_NetworkType;
}

export interface I_RiceparkRefreshReqParams {
	uid: string;
	tt_sig: string;
}

export interface I_RiceparkRefreshResponse {
	data: {
		params: string[];
		status: string;
		status_message: string;
		authenticate_url: {
			url: string;
			expanded_url: string;
			display_url: string;
			indices: number[];
		}[];
	};
}

export interface I_TxHistoryScoreboardQueryPayload {
	start_date: Date;
	end_date: Date;
	address: string;
	network_type: T_NetworkType;
}

export interface I_TxHistoryScoreboardResult {
	id: number;
	completed_tx_count: number;
	pending_tx_count: number;
	reverted_tx_count: number;
	wrap_count: number;
	unwrap_count: number;
	total_eth_swap: number;
	avg_eth_swap: number;
	total_tx_fee: number;
	avg_tx_fee: number;
	'transaction.id': number;
}
