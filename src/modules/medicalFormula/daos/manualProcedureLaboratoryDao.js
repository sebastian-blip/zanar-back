import Models from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';

export default class ManualProcedureLaboratoryDao extends ResourceDao {
	constructor() {
		super(Models.ManualProcedureLaboratory, 'ManualProcedureLaboratory');
	}
}

const manualProcedureLaboratoryDao = new ManualProcedureLaboratoryDao();

export { manualProcedureLaboratoryDao };
