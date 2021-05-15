import Models from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';

export default class OfficeScheduleDao extends ResourceDao {
	constructor() {
		super(Models.OfficeSchedules, 'OfficeSchedules');
	}
}

const officeScheduleDao = new OfficeScheduleDao();

export { officeScheduleDao };
