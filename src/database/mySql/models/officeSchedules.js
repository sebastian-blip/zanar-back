export default function(sequelize, DataTypes) {
	const officeSchedules = sequelize.define(
		'OfficeSchedules',
		{
			date: {
				type: DataTypes.DATEONLY,
				allowNull: false
			},
			morning: {
				type: DataTypes.STRING
			},
			afternoon: {
				type: DataTypes.STRING
			},
			night: {
				type: DataTypes.STRING
			}
		},
		{
			tableName: 'office_schedules'
		}
	);

	officeSchedules.associate = models => {
		officeSchedules.belongsTo(models.ConsultingRooms, {
			foreignKey: 'consulting_rooms_id'
		});
	};

	return officeSchedules;
}
