// import moment from 'moment';
import { officeScheduleDao } from '../dao/officeScheduleDao';
import * as DefaultMessages from '../../../utils/messages/default/default.json';

const getOfficeSchedulesByConsultingRoom = async consultingRoomId => {
	const result = await officeScheduleDao.getAll({ consulting_rooms_id: consultingRoomId });
	return result.records;
};

const getOfficeSchedulesByDoctor = async doctorId => {
	return officeScheduleDao.getOfficeSchedulesByDoctor(doctorId);
};

const create = async officeScheduleData => {
	const record = await officeScheduleDao.create(officeScheduleData);
	return record.id;
};

const update = async (id, officeScheduleData) => {
	await officeScheduleDao.update(id, officeScheduleData);
	return DefaultMessages.updateMessage;
};

const deleteRow = async id => {
	await officeScheduleDao.deleteRow(id);
	return DefaultMessages.deleteMessage;
};

export {
	getOfficeSchedulesByConsultingRoom,
	getOfficeSchedulesByDoctor,
	create,
	update,
	deleteRow
};
