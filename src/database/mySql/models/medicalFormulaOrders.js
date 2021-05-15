export default function(sequelize, DataTypes) {
	const medicalFormulaOrders = sequelize.define(
		'MedicalFormulas',
		{
			order_erp_id: {
				type: DataTypes.INTEGER
			}
		},
		{
			tableName: 'medical_formula_orders'
		}
	);

	medicalFormulaOrders.associate = models => {
		medicalFormulaOrders.belongsTo(models.MedicalFormulas, {
			foreignKey: 'formula_id'
		});
	};

	return medicalFormulaOrders;
}
