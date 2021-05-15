export default function(sequelize, DataTypes) {
	const medicalFormulaMedicines = sequelize.define(
		'MedicalFormulaMedicines',
		{
			code: {
				type: DataTypes.DATE
			},
			description: {
				type: DataTypes.STRING
			},
			presentation: {
				type: DataTypes.STRING
			},
			dose: {
				type: DataTypes.INTEGER
			},
			hours: {
				type: DataTypes.INTEGER
			},
			days: {
				type: DataTypes.INTEGER
			},
			start_time: {
				type: DataTypes.INTEGER
			},
			quantity: {
				type: DataTypes.INTEGER
			},
			posology: {
				type: DataTypes.STRING
			},
			recomendations: {
				type: DataTypes.STRING
			},
			recurring: {
				type: DataTypes.BOOLEAN
			},
			frecuency: {
				type: DataTypes.STRING
			},
			n_frecuency: {
				type: DataTypes.INTEGER
			},
			is_controlled: {
				type: DataTypes.BOOLEAN
			},
			is_new: {
				type: DataTypes.BOOLEAN
			}
		},
		{
			tableName: 'medical_formula_medicines'
		}
	);

	medicalFormulaMedicines.associate = models => {
		medicalFormulaMedicines.belongsTo(models.MedicalFormulas, {
			foreignKey: 'formula_id'
		});
	};

	return medicalFormulaMedicines;
}
