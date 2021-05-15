import * as officeService from '../../services/officeScheduleService';

const officeScheduleQueries = {
	getOfficeSchedulesByConsultingRoom: (root, { consultingRoomId }) =>
		officeService.getOfficeSchedulesByConsultingRoom(consultingRoomId),
	getOfficeSchedulesByDoctor: (root, { doctorId }) =>
		officeService.getOfficeSchedulesByDoctor(doctorId)
};

const officeScheduleMutations = {
	createOfficeSchedule: (root, { officeScheduleData }) => officeService.create(officeScheduleData),
	updateOfficeSchedule: (root, { id, officeScheduleData }) =>
		officeService.update(id, officeScheduleData),
	deleteRowOfficeSchedule: async (root, { id }) => officeService.deleteRow(id)
};

export { officeScheduleQueries, officeScheduleMutations };
