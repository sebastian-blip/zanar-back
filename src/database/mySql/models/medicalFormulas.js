export default function(sequelize, DataTypes) {
	const medicalFormulas = sequelize.define(
		'MedicalFormulas',
		{
			expedition_date: {
				type: DataTypes.DATE
			},
			diagnosis: {
				type: DataTypes.STRING
			},
			query_reason: {
				type: DataTypes.STRING
			},
			query_type: {
				type: DataTypes.STRING
			},
			recomendations: {
				type: DataTypes.STRING
			},
			send_mail: {
				type: DataTypes.BOOLEAN
			},
			send_whatsapp: {
				type: DataTypes.BOOLEAN
			},
			is_edited: {
				type: DataTypes.BOOLEAN
			},
			is_saved: {
				type: DataTypes.BOOLEAN
			},
			sent_notification: {
				type: DataTypes.BOOLEAN
			},
			crypt_id: {
				type: DataTypes.STRING
			},
			eps_id: {
				type: DataTypes.STRING
			}
		},
		{
			tableName: 'medical_formula'
		}
	);

	medicalFormulas.associate = models => {
		medicalFormulas.belongsTo(models.User, {
			foreignKey: 'doctor_id'
		});
		medicalFormulas.belongsTo(models.User, {
			foreignKey: 'patient_id'
		});
	};

	return medicalFormulas;
}
