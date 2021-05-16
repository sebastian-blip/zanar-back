import * as officeService from '../../services/officeScheduleService';

const officeScheduleQueries = {
	getOfficeScheduleDatesByMonth: (root, { doctorId, date }) =>
		officeService.getOfficeScheduleDatesByMonth(doctorId, date),
	getOfficeSchedulesByDoctor: (root, { doctorId, date }) =>
		officeService.getOfficeSchedulesByDoctor(doctorId, date)
};

const officeScheduleMutations = {
	createOfficeSchedule: (root, { officeScheduleData }) => officeService.create(officeScheduleData),
	updateOfficeSchedule: (root, { id, officeScheduleData }) =>
		officeService.update(id, officeScheduleData),
	deleteRowOfficeSchedule: async (root, { id }) => officeService.deleteRow(id)
};

export { officeScheduleQueries, officeScheduleMutations };
