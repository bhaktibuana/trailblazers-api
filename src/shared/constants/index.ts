import { AppConstant } from '@/shared/constants/app.constant';
import { DbConstant } from '@/shared/constants/db.constant';
import { Web3Constant } from '@/shared/constants/web3.constant';
import { TransactionConstant } from '@/shared/constants/transaction.constant';
import { RiceparkConstant } from '@/shared/constants/ricepark.constant';
import { NotPxConstant } from '@/shared/constants/not-px.constant';

export class Constant {
	public static app = new AppConstant();
	public static db = new DbConstant();
	public static web3 = new Web3Constant();
	public static transaction = new TransactionConstant();
	public static ricepark = new RiceparkConstant();
	public static notPX = new NotPxConstant();
}
