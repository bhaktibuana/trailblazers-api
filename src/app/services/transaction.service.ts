import { Response } from 'express';
import Web3Js from 'web3';
import dayjs from 'dayjs';

import { Service } from '@/shared/libs/service.lib';
import {
	CalculateGasPriceReqQuery,
	RpcListReqQuery,
	StartReqBody,
} from '@/transport/requests';
import { Res } from '@/shared/types/express';
import { Web3 } from '@/shared/utils';
import { Helper } from '@/shared/helpers';
import {
	I_Account,
	I_BalanceResult,
	I_CalculateGasPriceSvcResult,
	I_RpcListSvcResult,
	I_StartSvcResult,
} from '@/shared/interfaces';
import {
	TransactionHistoryRepository,
	TransactionRepository,
} from '@/app/repositories';
import { Constant } from '@/shared/constants';
import { Transaction, TransactionHistory } from '@/app/models';
import { RegisteredSubscription } from 'web3/lib/commonjs/eth.exports';

export class TransactionService extends Service {
	private transactionRepo: TransactionRepository;
	private transactionHistoryRepo: TransactionHistoryRepository;

	constructor() {
		super();

		this.transactionRepo = new TransactionRepository();
		this.transactionHistoryRepo = new TransactionHistoryRepository();
	}

	/**
	 * Calculate Gas Price - Transaction Service
	 *
	 * @param res
	 * @param reqQuery
	 * @returns
	 */
	public async calculateGasPrice(
		res: Response,
		reqQuery: CalculateGasPriceReqQuery,
	) {
		const account = (res as Res).locals.account;

		try {
			const web3Util = new Web3(account.network_type, account.rpc_id);
			const web3 = web3Util.web3;

			if (!web3)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Can not connect to web3 network',
				);

			const gasPrice = await web3Util.getGasPrice(
				reqQuery.increase_percentage,
			);

			if (!gasPrice)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Failed to get gas price',
				);

			return {
				network_type: account.network_type,
				base_gas_price:
					web3?.utils.fromWei(
						gasPrice?.base_gas_price as bigint,
						'ether',
					) + ' ETH',
				increased_gas_price:
					web3?.utils.fromWei(
						gasPrice?.increased_gas_price as bigint,
						'ether',
					) + ' ETH',
			} as I_CalculateGasPriceSvcResult;
		} catch (error) {
			await this.catchErrorHandler(
				res,
				error,
				this.calculateGasPrice.name,
			);
		}
		return null;
	}

	/**
	 * Get RPC List - Transaction Service
	 *
	 * @param res
	 * @param reqQuery
	 * @returns
	 */
	public async rpcList(
		res: Response,
		reqQuery: RpcListReqQuery,
	): Promise<I_RpcListSvcResult | null> {
		try {
			const web3Util = new Web3(reqQuery.network_type);
			const web3 = web3Util.web3;

			if (!web3)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Can not connect to web3 network',
				);

			const rpcs = Helper.getRpcList(reqQuery.network_type);

			let result: I_RpcListSvcResult['rpc_list'] = [];

			for (let i = 0; i < rpcs.length; i++) {
				const latencyStatus = await web3Util.getRpcLatency(rpcs[i]);
				result.push({
					...rpcs[i],
					is_online: latencyStatus.is_online,
					latency: latencyStatus.latency,
				});
			}

			result = result.sort((a, b) => {
				if (a.is_online === b.is_online) {
					return (a.latency as number) - (b.latency as number);
				}
				return a.is_online ? -1 : 1;
			});

			result = result.map((rpc) => ({
				...rpc,
				latency: `${(rpc.latency as number) / 1000}s`,
			}));

			return {
				network_type: reqQuery.network_type,
				rpc_list: result,
			} as I_RpcListSvcResult;
		} catch (error) {
			await this.catchErrorHandler(res, error, this.rpcList.name);
		}
		return null;
	}

	/**
	 * Start tnx - Transaction Service
	 *
	 * @param res
	 * @param reqBody
	 * @returns
	 */
	public async start(
		res: Response,
		reqBody: StartReqBody,
	): Promise<I_StartSvcResult | null> {
		const account = (res as Res).locals.account;
		const address = account.address.toLowerCase();

		try {
			const web3Util = new Web3(account.network_type, account.rpc_id);
			const web3 = web3Util.web3;

			if (!web3)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Can not connect to web3 network',
				);

			let transaction = await this.transactionRepo.findOne(res, {
				address,
				network_type: account.network_type,
			});

			if (transaction) {
				if (
					transaction.status ===
					Constant.transaction.TRANSACTION_STATUS_ONGOING
				)
					this.errorHandler(
						this.STATUS_CODE.BAD_REQUEST,
						'Tehere is an ongoing transaction, please stop or wait until finished before start the now one',
					);

				transaction = await this.transactionRepo.updateStatus(
					res,
					transaction.id as number,
					Constant.transaction.TRANSACTION_STATUS_ONGOING,
				);
			} else {
				transaction = await this.transactionRepo.create(res, {
					address,
					status: Constant.transaction.TRANSACTION_STATUS_ONGOING,
					network_type: account.network_type,
				});
			}

			this.processTransaction(
				account,
				reqBody,
				web3Util,
				transaction as Transaction,
			);

			return {
				network_type: account.network_type,
				address,
				start_at: dayjs().toDate(),
			};
		} catch (error) {
			await this.catchErrorHandler(res, error, this.start.name);
		}
		return null;
	}

	/**
	 * Stop tnx - Transaction Service
	 *
	 * @param res
	 * @returns
	 */
	public async stop(res: Response): Promise<Transaction | null> {
		const account = (res as Res).locals.account;
		const address = account.address.toLowerCase();

		try {
			const web3Util = new Web3(account.network_type, account.rpc_id);
			const web3 = web3Util.web3;

			if (!web3)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Can not connect to web3 network',
				);

			web3!.eth.accounts.wallet.remove(account.address);

			let transaction = await this.transactionRepo.findOne(res, {
				address,
				network_type: account.network_type,
				status: Constant.transaction.TRANSACTION_STATUS_ONGOING,
			});

			if (transaction) {
				transaction = await this.transactionRepo.updateStatus(
					res,
					transaction.id as number,
					Constant.transaction.TRANSACTION_STATUS_STOPPED,
				);
			} else {
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Tehere is no ongoing transaction',
				);
			}

			return transaction;
		} catch (error) {
			await this.catchErrorHandler(res, error, this.stop.name);
		}
		return null;
	}

	/**
	 * Wrap ETH - Transaction Service
	 *
	 * @param account
	 * @param increaseGasPrice
	 * @param web3Util
	 * @param amount
	 * @param transaction
	 * @returns
	 */
	private async wrap(
		account: I_Account,
		increaseGasPrice: number,
		web3Util: Web3,
		amount: string,
		transaction: Transaction,
	): Promise<boolean> {
		let isSuccess = false;

		const wethCa = Helper.getContractAddress(
			account.network_type,
			Constant.web3.TOKEN_WETH,
		);
		const wethAbi = Helper.getAbi(
			account.network_type,
			Constant.web3.TOKEN_WETH,
		);

		try {
			const web3 = web3Util.web3 as Web3Js<RegisteredSubscription>;
			web3!.eth.accounts.wallet.add(account.private_key);

			const wethContract = new web3.eth.Contract(
				wethAbi!.abi,
				wethCa!.contract_address,
			);

			const amountInWei = web3.utils.toWei(amount, 'ether');
			const tx = wethContract.methods.deposit();

			const txMethod = tx.encodeABI();
			const gas = await tx.estimateGas({
				from: account.address,
				value: amountInWei,
				data: txMethod,
			});

			const gasPrice = await web3Util.getGasPrice(increaseGasPrice);

			if (!gasPrice)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Can not get gas price',
				);

			const txData = {
				from: account.address,
				to: wethCa!.contract_address,
				data: txMethod,
				value: amountInWei,
				gas,
				gasPrice: gasPrice!.gas_price_hex,
			};

			let txHistory: TransactionHistory | null = null;

			await web3.eth
				.sendTransaction(txData)
				.on('transactionHash', async (txHash) => {
					txHistory = await this.transactionHistoryRepo.create(null, {
						transaction_id: transaction.id as number,
						transaction_hash: txHash,
						method: Constant.transaction
							.TRANSACTION_HISTORY_METHOD_WRAP,
						status: Constant.transaction
							.TRANSACTION_HISTORY_STATUS_PENDING,
						amount,
					});
					txHistory = await this.transactionHistoryRepo.findOneById(
						null,
						txHistory?.id as number,
					);
				})
				.on('receipt', async (receipt) => {
					const transactionTime = Helper.generateDiffTimeMS(
						txHistory?.created_at as Date,
					);

					const txFeeWei =
						receipt.gasUsed * gasPrice!.increased_gas_price;
					const txFee = web3!.utils.fromWei(txFeeWei, 'ether');

					await this.transactionHistoryRepo.updateById(
						null,
						txHistory!.id as number,
						{
							status: Constant.transaction
								.TRANSACTION_HISTORY_STATUS_COMPLETED,
							transaction_time: transactionTime,
							transaction_fee: txFee,
							finished_at: dayjs().toDate(),
						},
					);

					isSuccess = true;
				})
				.on('error', async (error) => {
					const transactionTime = Helper.generateDiffTimeMS(
						txHistory?.created_at as Date,
					);

					await this.transactionHistoryRepo.updateById(
						null,
						txHistory!.id as number,
						{
							status: Constant.transaction
								.TRANSACTION_HISTORY_STATUS_REVERTED,
							transaction_time: transactionTime,
							finished_at: dayjs().toDate(),
						},
					);

					isSuccess = false;

					this.errorHandler(
						this.STATUS_CODE.BAD_REQUEST,
						error.message,
					);
				});

			web3!.eth.accounts.wallet.remove(account.address);
		} catch (error) {
			isSuccess = false;
			await this.catchErrorHandler(null, error, this.wrap.name);
		}
		return isSuccess;
	}

	/**
	 * Unwrap WETH - Transaction Service
	 *
	 * @param account
	 * @param increaseGasPrice
	 * @param web3Util
	 * @param amount
	 * @param transaction
	 * @returns
	 */
	private async unwrap(
		account: I_Account,
		increaseGasPrice: number,
		web3Util: Web3,
		amount: string,
		transaction: Transaction,
	): Promise<boolean> {
		let isSuccess = false;

		const wethCa = Helper.getContractAddress(
			account.network_type,
			Constant.web3.TOKEN_WETH,
		);
		const wethAbi = Helper.getAbi(
			account.network_type,
			Constant.web3.TOKEN_WETH,
		);

		try {
			const web3 = web3Util.web3 as Web3Js<RegisteredSubscription>;
			web3!.eth.accounts.wallet.add(account.private_key);

			const wethContract = new web3.eth.Contract(
				wethAbi!.abi,
				wethCa!.contract_address,
			);

			const amountInWei = web3.utils.toWei(amount, 'ether');
			const tx = wethContract.methods.withdraw(amountInWei);

			const txMethod = tx.encodeABI();
			const gas = await tx.estimateGas({
				from: account.address,
				data: txMethod,
			});

			const gasPrice = await web3Util.getGasPrice(increaseGasPrice);

			if (!gasPrice)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Can not get gas price',
				);

			const txData = {
				from: account.address,
				to: wethCa!.contract_address,
				data: txMethod,
				gas,
				gasPrice: gasPrice!.gas_price_hex,
			};

			let txHistory: TransactionHistory | null = null;

			await web3.eth
				.sendTransaction(txData)
				.on('transactionHash', async (txHash) => {
					txHistory = await this.transactionHistoryRepo.create(null, {
						transaction_id: transaction.id as number,
						transaction_hash: txHash,
						method: Constant.transaction
							.TRANSACTION_HISTORY_METHOD_UNWRAP,
						status: Constant.transaction
							.TRANSACTION_HISTORY_STATUS_PENDING,
						amount,
					});
					txHistory = await this.transactionHistoryRepo.findOneById(
						null,
						txHistory?.id as number,
					);
				})
				.on('receipt', async (receipt) => {
					const transactionTime = Helper.generateDiffTimeMS(
						txHistory?.created_at as Date,
					);

					const txFeeWei =
						receipt.gasUsed * gasPrice!.increased_gas_price;
					const txFee = web3!.utils.fromWei(txFeeWei, 'ether');

					await this.transactionHistoryRepo.updateById(
						null,
						txHistory!.id as number,
						{
							status: Constant.transaction
								.TRANSACTION_HISTORY_STATUS_COMPLETED,
							transaction_time: transactionTime,
							transaction_fee: txFee,
							finished_at: dayjs().toDate(),
						},
					);

					isSuccess = true;
				})
				.on('error', async (error) => {
					const transactionTime = Helper.generateDiffTimeMS(
						txHistory?.created_at as Date,
					);

					await this.transactionHistoryRepo.updateById(
						null,
						txHistory!.id as number,
						{
							status: Constant.transaction
								.TRANSACTION_HISTORY_STATUS_REVERTED,
							transaction_time: transactionTime,
							finished_at: dayjs().toDate(),
						},
					);

					isSuccess = false;

					this.errorHandler(
						this.STATUS_CODE.BAD_REQUEST,
						error.message,
					);
				});

			web3!.eth.accounts.wallet.remove(account.address);
		} catch (error) {
			isSuccess = false;
			await this.catchErrorHandler(null, error, this.unwrap.name);
		}
		return isSuccess;
	}

	/**
	 * Process wrap-unwrap transaction - Transaction Service
	 * @param account
	 * @param reqBody
	 * @param web3Util
	 * @param transaction
	 * @returns
	 */
	private async processTransaction(
		account: I_Account,
		reqBody: StartReqBody,
		web3Util: Web3,
		transaction: Transaction,
	) {
		const increaseGasPrice = reqBody.increase_gas_price_percentage;
		const txCount = reqBody.transaction_count;

		let currentTxCount = 0;
		let isLastTxError = false;
		let web3: Web3Js<RegisteredSubscription> | null = null;

		try {
			web3 = web3Util.web3 as Web3Js<RegisteredSubscription>;

			while (currentTxCount < txCount) {
				try {
					if (!isLastTxError) {
						currentTxCount += 1;
					}
					isLastTxError = false;

					const ethBalance = (await web3Util.getBalance(
						account.address,
						Constant.web3.TOKEN_ETH,
					)) as I_BalanceResult;
					const wethBalance = (await web3Util.getBalance(
						account.address,
						Constant.web3.TOKEN_WETH,
					)) as I_BalanceResult;

					const ethMinBalance = {
						ether: Constant.transaction.MIN_BALANCE_ETH,
						wei: BigInt(
							web3.utils.toWei(
								Constant.transaction.MIN_BALANCE_ETH,
								'ether',
							),
						),
					};

					if (
						BigInt(ethBalance.amount_wei) >
						BigInt(wethBalance.amount_wei)
					) {
						if (
							(ethMinBalance.wei * BigInt(80)) / BigInt(100) >=
							BigInt(ethBalance.amount_wei)
						) {
							this.errorHandler(
								this.STATUS_CODE.BAD_REQUEST,
								'Balance of ETH must be at least 0.00008 ETH',
							);
							break;
						}

						const ethAmount = web3.utils.fromWei(
							BigInt(ethBalance.amount_wei) - ethMinBalance.wei,
							'ether',
						);

						await this.wrap(
							account,
							increaseGasPrice,
							web3Util,
							ethAmount,
							transaction,
						);
					} else {
						const wethAmount = wethBalance.amount;
						await this.unwrap(
							account,
							increaseGasPrice,
							web3Util,
							wethAmount,
							transaction,
						);
					}
				} catch (error) {
					isLastTxError = true;
					await Helper.sleep(120 * 1000); // sleep for 2 minutes
					continue;
				}
			}
		} catch (error) {
			await this.catchErrorHandler(
				null,
				error,
				this.processTransaction.name,
			);
		}

		web3!.eth.accounts.wallet.remove(account.address);
		await this.transactionRepo.updateStatus(
			null,
			transaction.id as number,
			Constant.transaction.TRANSACTION_STATUS_STOPPED,
		);

		return null;
	}
}
