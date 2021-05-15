export default function(sequelize, DataTypes) {
	const medicalFormulaLaboratory = sequelize.define(
		'MedicalFormulaLaboratory',
		{
			code: {
				type: DataTypes.DATE
			},
			description: {
				type: DataTypes.STRING
			},
			recomendations: {
				type: DataTypes.STRING
			}
		},
		{
			tableName: 'medical_formula_laboratory'
		}
	);

	medicalFormulaLaboratory.associate = models => {
		medicalFormulaLaboratory.belongsTo(models.MedicalFormulas, {
			foreignKey: 'formula_id'
		});
	};

	return medicalFormulaLaboratory;
}
