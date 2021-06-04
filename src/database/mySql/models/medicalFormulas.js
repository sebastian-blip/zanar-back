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
				type: DataTypes.ENUM('FACETOFACE', 'ONLINE')
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
			tableName: 'medical_formulas'
		}
	);

	medicalFormulas.associate = models => {
		medicalFormulas.belongsTo(models.User, {
			foreignKey: 'doctor_id',
			as: 'Doctor'
		});
		medicalFormulas.belongsTo(models.User, {
			foreignKey: 'patient_id',
			as: 'Patient'
		});
		medicalFormulas.belongsTo(models.ServiceProviderEPS, {
			foreignKey: 'eps_id'
		});
		medicalFormulas.hasMany(models.ManualMedications, {
			foreignKey: 'formula_id'
		});
		medicalFormulas.hasMany(models.ManualProcedureLaboratory, {
			foreignKey: 'formula_id'
		});
		medicalFormulas.hasMany(models.MedicalFormulaMedicines, {
			foreignKey: 'formula_id'
		});
		medicalFormulas.hasMany(models.MedicalFormulaLaboratory, {
			foreignKey: 'formula_id'
		});
		medicalFormulas.hasMany(models.MedicalFormulaProcedures, {
			foreignKey: 'formula_id'
		});
		medicalFormulas.hasMany(models.DiagnosisDiseases, {
			foreignKey: 'formula_id'
		});
	};

	return medicalFormulas;
}
