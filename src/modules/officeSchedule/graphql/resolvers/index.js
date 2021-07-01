import * as officeService from '../../services/officeScheduleService';
import { isAuthenticate } from '../../../authentication/services/authenticationService';

const officeScheduleQueries = {
	getOfficeScheduleDatesByMonth: (root, { doctorId, date }, context) => {
		isAuthenticate(context);
		return officeService.getOfficeScheduleDatesByMonth(doctorId, date);
	},
	getOfficeSchedulesByDoctor: (root, { doctorId, date }, context) => {
		isAuthenticate(context);
		return officeService.getOfficeSchedulesByDoctor(doctorId, date);
	}
};

const officeScheduleMutations = {
	createOfficeSchedule: (root, { officeScheduleData }, context) => {
		isAuthenticate(context);
		return officeService.create(officeScheduleData);
	},
	createOfficeScheduleByRange: (root, { officeScheduleRange }, context) => {
		isAuthenticate(context);
		return officeService.createOfficeScheduleByRange(officeScheduleRange);
	},
	updateOfficeSchedule: (root, { id, officeScheduleData }, context) => {
		isAuthenticate(context);
		return officeService.update(id, officeScheduleData);
	},
	deleteRowOfficeSchedule: async (root, { id }, context) => {
		isAuthenticate(context);
		return officeService.deleteRow(id);
	}
};

export { officeScheduleQueries, officeScheduleMutations };
