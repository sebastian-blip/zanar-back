export default function(sequelize, DataTypes) {
	const medicalFormulaProcedures = sequelize.define(
		'MedicalFormulaProcedures',
		{
			code: {
				type: DataTypes.DATE
			},
			description: {
				type: DataTypes.STRING
			},
			recomendations: {
				type: DataTypes.STRING
			},
			sessions: {
				type: DataTypes.INTEGER
			},
			approximate_time: {
				type: DataTypes.STRING
			}
		},
		{
			tableName: 'medical_formula_procedures'
		}
	);

	medicalFormulaProcedures.associate = models => {
		medicalFormulaProcedures.belongsTo(models.MedicalFormulas, {
			foreignKey: 'formula_id'
		});
		medicalFormulaProcedures.belongsTo(models.User, {
			foreignKey: 'patient_id'
		});
	};

	return medicalFormulaProcedures;
}
