import { AppConstant } from '@/shared/constants/app.constant';
import { DbConstant } from '@/shared/constants/db.constant';
import { Web3Constant } from '@/shared/constants/web3.constant';

export class Constant {
	public static app = new AppConstant();
	public static db = new DbConstant();
	public static web3 = new Web3Constant();
}
