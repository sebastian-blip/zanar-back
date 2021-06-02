export default function(sequelize, DataTypes) {
	const consultingRooms = sequelize.define(
		'ConsultingRooms',
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: false
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false
			},
			type_address: {
				type: DataTypes.STRING,
				allowNull: false
			},
			city: {
				type: DataTypes.STRING,
				allowNull: false
			},
			name_assistant: {
				type: DataTypes.STRING,
				allowNull: false
			},
			phone_assistant: {
				type: DataTypes.STRING,
				allowNull: false
			},
			duration_of_appointment: {
				type: DataTypes.STRING,
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
			tableName: 'consulting_rooms'
		}
	);

	consultingRooms.associate = models => {
		consultingRooms.hasMany(models.OfficeSchedules, {
			foreignKey: 'consulting_rooms_id'
		});
		consultingRooms.belongsTo(models.User, {
			foreignKey: 'doctor_id'
		});
	};

	return consultingRooms;
}
