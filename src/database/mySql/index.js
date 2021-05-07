import Sequelize, { DataTypes } from 'sequelize';
import ConsultingRooms from './models/consultingRooms';
import OfficeSchedules from './models/officeSchedules';
import Miles from './models/miles';

const sequelize = new Sequelize(
	process.env.DATABASE,
	process.env.DATABASE_USER,
	process.env.DATABASE_PASSWORD,
	{
		host: process.env.DATABASE_HOST,
		dialect: 'mysql'
	}
);

const models = {
	ConsultingRooms: ConsultingRooms(sequelize, DataTypes),
	OfficeSchedules: OfficeSchedules(sequelize, DataTypes),
	Miles: Miles(sequelize, DataTypes)
};

Object.keys(models).forEach(key => {
	if ('associate' in models[key]) {
		models[key].associate(sequelize.models);
	}
});

// eslint-disable-next-line import/prefer-default-export
export { sequelize };
