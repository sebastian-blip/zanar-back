import Models, { sequelize } from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';

export default class DiseaseDao extends ResourceDao {
	constructor() {
		super(Models.Diseases, 'Diseases');
	}

	// eslint-disable-next-line class-methods-use-this
	parseFilters(filter) {
		let where = '1 = 1';
		for (const property in filter) {
			where += ` AND ${property} LIKE '%${filter[property]}%'`;
		}
		return sequelize.literal(where);
	}
}

const diseaseDao = new DiseaseDao();

export { diseaseDao };
