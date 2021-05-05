import {
	getOfficeSchedulesByConsultingRoom,
	create,
	deleteRow,
	update
} from '../../../services/officeSchedule';

const officeScheduleQueries = {
	getOfficeSchedulesByConsultingRoom
};

const officeScheduleMutations = {
	createOfficeSchedule: create,
	updateOfficeSchedule: update,
	deleteRowOfficeSchedule: deleteRow
};

export { officeScheduleQueries, officeScheduleMutations };
