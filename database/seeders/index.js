const Sequelize = require('sequelize');
const fs = require('fs');
require('dotenv').config();

const sequelize = new Sequelize(
	process.env.MAIN_MYSQL_DB_NAME,
	process.env.MAIN_MYSQL_DB_USER,
	process.env.MAIN_MYSQL_DB_PASSWORD,
	{
		host: process.env.MAIN_MYSQL_DB_HOST,
		dialect: 'mysql',
		port: process.env.MAIN_MYSQL_DB_PORT,
		logging: false,
	},
);

const SeedsLog = sequelize.define(
	'seed_logs',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		name: {
			type: Sequelize.STRING(255),
			unique: true,
			allowNull: false,
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
	},
	{
		tableName: 'seed_logs',
		freezeTableName: false,
		timestamps: false,
	},
);

// Function to run new seeders
async function runNewSeeders() {
	try {
		// Synchronize the SeedsLog model with the database
		await SeedsLog.sync();

		// Query the SeedsLog table to get executed seeders
		const executedSeeders = await SeedsLog.findAll({
			attributes: ['name'],
		});

		// Create an array of executed seeder names
		const executedSeederNames = executedSeeders.map((seed) => seed.name);

		// Get a list of all available seeder files in your project
		const availableSeeders = [
			...fs.readdirSync(__dirname).filter((file) => {
				return file.indexOf('.') !== 0 && file !== 'index.js';
			}),
		];

		// Filter the available seeders to find the new ones
		const newSeeders = availableSeeders.filter(
			(seeder) => !executedSeederNames.includes(seeder),
		);

		// Execute the new seeders
		for (const seeder of newSeeders) {
			console.log(`Running seeder: ${seeder}`);
			const seederModule = require(`./${seeder}`);
			await seederModule.up(sequelize.getQueryInterface(), Sequelize);
			await SeedsLog.create({ name: seeder }); // Log the seeder as executed
		}

		console.log('All new seeders have been executed.');
	} catch (error) {
		console.error('Error running seeders:', error);
	} finally {
		// Close the database connection
		sequelize.close();
	}
}

// Run the function to execute new seeders
runNewSeeders();
