export default function(sequelize, DataTypes) {
	const diagnosis = sequelize.define(
		'Diagnosis',
		{
			description: {
				type: DataTypes.STRING
			}
		},
		{
			tableName: 'diagnosis'
		}
	);

	diagnosis.associate = models => {
		diagnosis.belongsTo(models.MedicalFormulas, {
			foreignKey: 'formula_id'
		});
		diagnosis.belongsTo(models.User, {
			foreignKey: 'doctor_id'
		});
		diagnosis.belongsTo(models.User, {
			foreignKey: 'patient_id'
		});
	};

	return diagnosis;
}
