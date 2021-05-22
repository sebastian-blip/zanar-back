import Models from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';

export default class DiagnosisDiseasesDao extends ResourceDao {
	constructor() {
		super(Models.DiagnosisDiseases, 'DiagnosisDiseases');
	}
}

const diagnosisDiseasesDao = new DiagnosisDiseasesDao();

export { diagnosisDiseasesDao };
