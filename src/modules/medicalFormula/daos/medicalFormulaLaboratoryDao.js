import Models from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';

export default class MedicalFormulaLaboratoryDao extends ResourceDao {
	constructor() {
		super(Models.MedicalFormulaLaboratory, 'MedicalFormulaLaboratory');
	}
}

const medicalFormulaLaboratoryDao = new MedicalFormulaLaboratoryDao();

export { medicalFormulaLaboratoryDao };
