'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('transactions', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			address: {
				type: Sequelize.STRING(255),
				allowNull: false,
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
		await queryInterface.dropTable('transactions');
	},
};
