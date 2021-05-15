import Models from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';

export default class MedicalFormulaDao extends ResourceDao {
	constructor() {
		super(Models.MedicalFormulas, 'MedicalFormulas');
	}
}

const medicalFormulaDao = new MedicalFormulaDao();

export { medicalFormulaDao };
