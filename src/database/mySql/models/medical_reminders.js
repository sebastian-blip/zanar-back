const Sequelize = require('sequelize');
export default function(sequelize, DataTypes) {
	const MedicalReminder = sequelize.define(
		'MedicalReminder',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true
			},
			reminder_title: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: 'New consult scheduled'
			},
			reminder_time: {
				type: DataTypes.TIME,
				allowNull: false
			},
			reminder_duration: {
				type: DataTypes.TIME,
				allowNull: false
			},
			turn: {
				type: DataTypes.STRING(10),
				allowNull: false,
				defaultValue: 'morning'
			},
			reminder_date: {
				type: DataTypes.DATEONLY,
				allowNull: false
			},
			reminder_status: {
				type: DataTypes.BOOLEAN,
				allowNull: false
			},
			doctor_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: true,
				references: {
					model: 'users',
					key: 'id'
				}
			},
			patient_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: true,
				references: {
					model: 'users',
					key: 'id'
				}
			},
			consulting_room_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'consulting_rooms',
					key: 'id'
				}
			}
		},
		{
			sequelize,
			tableName: 'medical_reminders',
			timestamps: false
		}
	);

	MedicalReminder.associate = Models => {
		const { User, ConsultingRooms } = Models;

		MedicalReminder.belongsTo(User, {
			foreignKey: 'doctor_id',
			constraints: true,
			as: 'Doctor'
		});

		MedicalReminder.belongsTo(User, {
			foreignKey: 'patient_id',
			constraints: true,
			as: 'Patient'
		});

		MedicalReminder.belongsTo(ConsultingRooms, {
			foreignKey: 'consulting_room_id',
			constraints: true,
			as: 'ConsultingRoom'
		});
	};

	return MedicalReminder;
}
