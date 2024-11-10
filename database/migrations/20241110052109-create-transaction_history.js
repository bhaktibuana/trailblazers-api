'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('transaction_histories', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			transaction_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'transactions',
					key: 'id',
				},
				onDelete: 'CASCADE',
			},
			transaction_hash: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			method: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			status: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			amount: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			transaction_fee: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			transaction_time: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			finished_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('NOW()'),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('NOW()'),
			},
			deleted_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('transaction_histories');
	},
};
