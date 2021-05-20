export default function(sequelize, DataTypes) {
	const diagnosisDiseases = sequelize.define(
		'DiagnosisDiseases',
		{
			description: {
				type: DataTypes.STRING
			}
		},
		{
			tableName: 'diagnosis_diseases'
		}
	);

	diagnosisDiseases.associate = models => {
		diagnosisDiseases.belongsTo(models.MedicalFormulas, {
			foreignKey: 'formula_id'
		});
		diagnosisDiseases.belongsTo(models.Diseases, {
			foreignKey: 'disease_id'
		});
	};

	return diagnosisDiseases;
}
