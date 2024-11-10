import {
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
	Sequelize,
} from 'sequelize';

import { MySQL } from '@/shared/utils';
import { Transaction } from '@/app/models/transaction.model';

export class TransactionHistory extends Model<
	InferAttributes<TransactionHistory>,
	InferCreationAttributes<TransactionHistory>
> {
	public id?: number;
	public transaction_id!: number;
	public transaction_hash!: string;
	public method!: string;
	public status!: string;
	public amount!: string;
	public transaction_fee?: string | null;
	public transaction_time?: string | null;
	public finished_at?: Date | null;
	public created_at?: Date;
	public updated_at?: Date;
	public deleted_at?: Date | null;

	public static associate() {
		TransactionHistory.belongsTo(Transaction, {
			as: 'transaction',
			foreignKey: 'transaction_id',
		});
	}
}

TransactionHistory.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		transaction_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'transactions',
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		transaction_hash: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		method: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		amount: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		transaction_fee: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		transaction_time: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		finished_at: {
			type: DataTypes.DATE,
			allowNull: true,
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
		tableName: 'transaction_histories',
		freezeTableName: false,
		timestamps: false,
		sequelize: MySQL.getMainDbConnection(),
	},
);
