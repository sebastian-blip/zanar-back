export default function(sequelize, DataTypes) {
	const milesForSales = sequelize.define(
		'MileForSale',
		{
			doctor_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: true,
				references: {
					model: 'users',
					key: 'id'
				}
			},
			formula_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'medical_formulas',
					key: 'id'
				}
			},
			medical_formula_order_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
				references: {
					model: 'medical_formula_orders',
					key: 'id'
				}
			},
			mile: {
				type: DataTypes.INTEGER
			},
			exchange: {
				type: DataTypes.BOOLEAN
			},
			exchange_date: {
				type: DataTypes.DATE
			}
		},
		{
			tableName: 'miles_for_sales',
			timestamps: true,
			underscored: true,
		}
	);

	milesForSales.associate = models => {
		milesForSales.belongsTo(models.User, {
			as: 'doctor',
			foreignKey: 'doctor_id'
		});

		milesForSales.belongsTo(models.MedicalFormulas, {
			as: 'medicalFormula',
			foreignKey: 'formula_id'
		});

		milesForSales.belongsTo(models.MedicalFormulaOrder, {
			as: 'medicalFormulaOrder',
			foreignKey: 'medical_formula_order_id'
		});
	};

	return milesForSales;
}
