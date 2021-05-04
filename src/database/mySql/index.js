import Sequelize from 'sequelize';

const sequelize = new Sequelize(
	process.env.DATABASE,
	process.env.DATABASE_USER,
	process.env.DATABASE_PASSWORD,
	{
		host: process.env.DATABASE_HOST,
		dialect: 'mysql'
	}
);

// eslint-disable-next-line import/prefer-default-export
export { sequelize };
