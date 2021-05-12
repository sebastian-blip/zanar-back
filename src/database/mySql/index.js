import Sequelize from 'sequelize';
import { database as DatabaseConfig } from '../../config';
import { initializeModels } from './models';

const sequelize = new Sequelize(
	DatabaseConfig.DATABASE,
	DatabaseConfig.USER,
	DatabaseConfig.PASSWORD,
	{
		logging: DatabaseConfig.LOGGING,
		host: DatabaseConfig.HOST,
		dialect: DatabaseConfig.DIALECT
	}
);

initializeModels(sequelize);

const { models } = sequelize;
export { sequelize };
export { models };
export default models;
