export default function(sequelize, DataTypes) {
	const manualMedications = sequelize.define(
		'ManualMedications',
		{
			description: {
				type: DataTypes.STRING
			},
			type: {
				type: DataTypes.ENUM('procedure', 'laboratory')
			}
		},
		{
			tableName: 'manual_procedure_laboratory'
		}
	);

	manualMedications.associate = models => {
		manualMedications.belongsTo(models.MedicalFormulas, {
			foreignKey: 'formula_id'
		});
	};

	return manualMedications;
}
