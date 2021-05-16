export default function(sequelize, DataTypes) {
	const medicalFormulas = sequelize.define(
		'MedicalFormulas',
		{
			diagnosis: {
				type: DataTypes.STRING
			},
			query_reason: {
				type: DataTypes.STRING
			},
			query_type: {
				type: DataTypes.ENUM('FACE-TO-FACE', 'ONLINE')
			},
			recomendations: {
				type: DataTypes.STRING
			},
			send_mail: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			send_whatsapp: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			is_edited: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			is_saved: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			sent_notification: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			crypt_id: {
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
		medicalFormulas.belongsTo(models.ServiceProviderEPS, {
			foreignKey: 'eps_id'
		});
	};

	return medicalFormulas;
}
