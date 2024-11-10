import {
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
	Sequelize,
} from 'sequelize';

import { MySQL } from '@/shared/utils';
import { TransactionHistory } from '@/app/models/transaction-history.model';

export class Transaction extends Model<
	InferAttributes<Transaction>,
	InferCreationAttributes<Transaction>
> {
	public id?: number;
	public address!: string;
	public status!: string;
	public network_type!: string;
	public created_at?: Date;
	public updated_at?: Date;
	public deleted_at?: Date | null;

	public static associate() {
		Transaction.hasOne(TransactionHistory, {
			as: 'transaction_histories',
			foreignKey: 'transaction_id',
		});
	}
}

Transaction.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		address: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		network_type: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal('NOW()'),
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal('NOW()'),
		},
		deleted_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		tableName: 'transactions',
		freezeTableName: false,
		timestamps: false,
		sequelize: MySQL.getMainDbConnection(),
	},
);
