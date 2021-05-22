export default function(sequelize, DataTypes) {
	const manualMedications = sequelize.define(
		'ManualMedications',
		{
			description: {
				type: DataTypes.STRING
			},
			is_controlled: {
				type: DataTypes.BOOLEAN
			},
			posology: {
				type: DataTypes.STRING
			}
		},
		{
			tableName: 'manual_medications'
		}
	);

	manualMedications.associate = models => {
		manualMedications.belongsTo(models.MedicalFormulas, {
			foreignKey: 'formula_id'
		});
	};

	return manualMedications;
}
