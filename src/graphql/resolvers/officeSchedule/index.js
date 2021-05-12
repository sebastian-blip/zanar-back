import * as officeService from '../../../services/officeSchedule';

const officeScheduleQueries = {
	getOfficeSchedulesByConsultingRoom: (root, { consultingRoomId }) =>
		officeService.getOfficeSchedulesByConsultingRoom(consultingRoomId)
};

const officeScheduleMutations = {
	createOfficeSchedule: (root, { officeScheduleData }) => officeService.create(officeScheduleData),
	updateOfficeSchedule: (root, { id, officeScheduleData }) =>
		officeService.update(id, officeScheduleData),
	deleteRowOfficeSchedule: async (root, { id }) => officeService.deleteRow(id)
};

export { officeScheduleQueries, officeScheduleMutations };
