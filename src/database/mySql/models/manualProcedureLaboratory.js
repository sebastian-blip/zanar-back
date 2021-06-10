export default function(sequelize, DataTypes) {
	const manualProcedureLaboratory = sequelize.define(
		'ManualProcedureLaboratory',
		{
			description: {
				type: DataTypes.STRING
			},
			type: {
				type: DataTypes.ENUM('PROCEDURE', 'LABORATORY')
			},
			recomendations: {
				type: DataTypes.STRING
			}
		},
		{
			tableName: 'manual_procedure_laboratory'
		}
	);

	manualProcedureLaboratory.associate = models => {
		manualProcedureLaboratory.belongsTo(models.MedicalFormulas, {
			foreignKey: 'formula_id'
		});
	};

	return manualProcedureLaboratory;
}
