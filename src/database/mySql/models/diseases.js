export default function(sequelize, DataTypes) {
	const diseases = sequelize.define(
		'Diseases',
		{
			description: {
				type: DataTypes.STRING
			},
			CIE10_4D: {
				type: DataTypes.STRING
			},
			category_id: {
				type: DataTypes.STRING
			}
		},
		{
			tableName: 'diseases'
		}
	);

	return diseases;
}
