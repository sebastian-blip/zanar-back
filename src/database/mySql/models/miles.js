const MilesForSales = (sequelize, DataTypes) => {
	const milesForSales = sequelize.define('miles_for_sales', {
		doctor_id: {
			type: DataTypes.STRING
		},
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
	});

	return milesForSales;
};

export default MilesForSales;
