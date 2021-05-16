import moment from 'moment';
import Models, { sequelize } from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';

export default class OfficeScheduleDao extends ResourceDao {
	constructor() {
		super(Models.OfficeSchedules, 'OfficeSchedules');
		this.consultingRoomsModel = Models.ConsultingRooms;
	}

	getOfficeSchedulesByDoctor(doctorId, date) {
		const momentDate = moment(date).format('YYYY-MM-DD');
		const where = sequelize.literal(`DATE(OfficeSchedules.date) = '${momentDate}'`);
		return this.model.findAll({
			include: {
				model: this.consultingRoomsModel,
				where: {
					doctor_id: doctorId
				}
			},
			where
		});
	}

	getOfficeScheduleDatesByMonth(doctorId, date) {
		const monthNumber = moment(date).format('M');
		const where = sequelize.literal(`MONTH(DATE(OfficeSchedules.date)) = ${monthNumber}`);
		return this.model.findAll({
			attributes: [
				[sequelize.fn('DISTINCT', sequelize.literal('DATE(OfficeSchedules.date)')), 'date']
			],
			include: {
				attributes: [],
				model: this.consultingRoomsModel,
				where: {
					doctor_id: doctorId
				}
			},
			where,
			raw: true
		});
	}
}

const officeScheduleDao = new OfficeScheduleDao();

export { officeScheduleDao };
