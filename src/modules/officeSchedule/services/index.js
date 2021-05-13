// import moment from 'moment';
import * as officeScheduleDao from '../../../dao/officeSchedule';
import * as DefaultMessages from '../../../utils/messages/default/default.json';

const getOfficeSchedulesByConsultingRoom = consultingRoomId => {
	return officeScheduleDao.getOfficeSchedulesByConsultingRoom(consultingRoomId);
};

const create = officeScheduleData => {
	return officeScheduleDao.create(officeScheduleData);
};

const update = async (id, officeScheduleData) => {
	await officeScheduleDao.update(id, officeScheduleData);
	return DefaultMessages.updateMessage;
};

const deleteRow = async id => {
	await officeScheduleDao.deleteRow(id);
	return DefaultMessages.deleteMessage;
};

export { getOfficeSchedulesByConsultingRoom, create, update, deleteRow };
