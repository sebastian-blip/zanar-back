export default function(sequelize, DataTypes) {
	const medicalFormulaOrders = sequelize.define(
		'MedicalFormulaOrder',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				primaryKey: true
			},
			formula_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'medical_formulas',
					key: 'id'
				}
			},
			is_invoiced: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 0
			},
			client_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false
			},
		},
		{
			tableName: 'medical_formula_orders',
			underscored: true,
		}
	);

	medicalFormulaOrders.associate = models => {
		medicalFormulaOrders.belongsTo(models.MedicalFormulas, {
			foreignKey: 'formula_id'
		});
	};

	return medicalFormulaOrders;
}
