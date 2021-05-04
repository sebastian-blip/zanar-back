import { DataTypes } from 'sequelize';
import { sequelize } from '..';

sequelize.define('UserTest', {
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false
	},
	cellphone: {
		type: DataTypes.STRING,
		allowNull: false
	},
	document: {
		type: DataTypes.STRING,
		allowNull: false
	}
});

export default sequelize.models.UserTest;
