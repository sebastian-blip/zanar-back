// import moment from 'moment';
import * as officeScheduleDao from '../../dao/officeSchedule';
import * as DefaultMessages from '../../utils/messages/default/default.json';

const getOfficeSchedulesByConsultingRoom = (root, { consultingRoomId }) => {
	return officeScheduleDao.getOfficeSchedulesByConsultingRoom(consultingRoomId);
};

const create = (root, { officeScheduleData }) => {
	return officeScheduleDao.create(officeScheduleData);
};

const update = async (root, { id, officeScheduleData }) => {
	await officeScheduleDao.update(id, officeScheduleData);
	return DefaultMessages.updateMessage;
};

const deleteRow = async (root, { id }) => {
	await officeScheduleDao.deleteRow(id);
	return DefaultMessages.deleteMessage;
};

export { getOfficeSchedulesByConsultingRoom, create, update, deleteRow };
