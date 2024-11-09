import {
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
	Sequelize,
} from 'sequelize';

import { MySQL } from '@/shared/utils';

export class Transaction extends Model<
	InferAttributes<Transaction>,
	InferCreationAttributes<Transaction>
> {
	public id?: number;
	public address!: string;
	public transaction_hash!: string;
	public method!: string;
	public status!: string;
	public amount!: string;
	public transaction_fee?: string;
	public transaction_time?: string;
	public finished_at?: Date;
	public created_at?: Date;
	public updated_at?: Date;
	public deleted_at?: Date;
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
		tableName: 'transactions',
		freezeTableName: false,
		timestamps: false,
		sequelize: MySQL.getMainDbConnection(),
	},
);
