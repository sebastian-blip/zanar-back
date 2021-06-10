export default function(sequelize, DataTypes) {
	const milesForSales = sequelize.define(
		'Miles',
		{
			product_id: {
				type: DataTypes.STRING
			},
			mile: {
				type: DataTypes.INTEGER
			},
			exchange: {
				type: DataTypes.BOOLEAN
			},
			number_order: {
				type: DataTypes.STRING
			},
			sync: {
				type: DataTypes.BOOLEAN
			}
		},
		{
			tableName: 'miles_for_sales'
		}
	);

	milesForSales.associate = models => {
		milesForSales.belongsTo(models.User, {
			foreignKey: 'doctor_id'
		});
	};

	return milesForSales;
}
