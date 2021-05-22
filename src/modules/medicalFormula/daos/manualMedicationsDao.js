import Models from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';

export default class ManualMedicationsDao extends ResourceDao {
	constructor() {
		super(Models.ManualMedications, 'ManualMedications');
	}
}

const manualMedicationsDao = new ManualMedicationsDao();

export { manualMedicationsDao };
