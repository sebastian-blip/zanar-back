const ConsultingRooms = (sequelize, DataTypes) => {
	const consultingRooms = sequelize.define('consulting_rooms', {
		doctor_id: {
			type: DataTypes.STRING,
			allowNull: false
		},
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
		affternon: {
			type: DataTypes.STRING
		},
		night: {
			type: DataTypes.STRING
		}
	});

	consultingRooms.associate = models => {
		consultingRooms.hasMany(models.office_schedules, {
			foreignKey: 'consulting_rooms_id'
		});
	};

	return consultingRooms;
};

export default ConsultingRooms;
