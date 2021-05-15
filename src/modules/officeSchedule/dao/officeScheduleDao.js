import Models from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';

export default class OfficeScheduleDao extends ResourceDao {
	constructor() {
		super(Models.OfficeSchedules, 'OfficeSchedules');
		this.consultingRoomsModel = Models.ConsultingRooms;
	}

	getOfficeSchedulesByDoctor(doctorId) {
		return this.model.findAll({
			include: {
				model: this.consultingRoomsModel,
				where: {
					doctor_id: doctorId
				}
			}
		});
	}
}

const officeScheduleDao = new OfficeScheduleDao();

export { officeScheduleDao };
