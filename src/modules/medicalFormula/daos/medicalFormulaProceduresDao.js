import Models from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';

export default class MedicalFormulaProceduresDao extends ResourceDao {
	constructor() {
		super(Models.MedicalFormulaProcedures, 'MedicalFormulaProcedures');
	}
}

const medicalFormulaProceduresDao = new MedicalFormulaProceduresDao();

export { medicalFormulaProceduresDao };
