import { JwtPayload, VerifyErrors } from 'jsonwebtoken';

import { T_NetworkType } from '@/shared/types';

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
	name: string;
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
