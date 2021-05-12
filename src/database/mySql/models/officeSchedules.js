export default function(sequelize, DataTypes) {
	const officeSchedules = sequelize.define('office_schedules', {
		date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		morning: {
			type: DataTypes.STRING
		},
		affternon: {
			type: DataTypes.STRING
		},
		night: {
			type: DataTypes.STRING
		}
	});

	officeSchedules.associate = models => {
		officeSchedules.belongsTo(models.consulting_rooms, {
			foreignKey: 'consulting_rooms_id'
		});
	};

	return officeSchedules;
}
