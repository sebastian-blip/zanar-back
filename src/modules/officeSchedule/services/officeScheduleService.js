import { officeScheduleDao } from '../dao/officeScheduleDao';
import * as DefaultMessages from '../../../utils/messages/default/default.json';

const getOfficeScheduleDatesByMonth = (doctorId, date) => {
	return officeScheduleDao.getOfficeScheduleDatesByMonth(doctorId, date);
};

const getOfficeSchedulesByDoctor = (doctorId, date) => {
	return officeScheduleDao.getOfficeSchedulesByDoctor(doctorId, date);
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
	await officeScheduleDao.delete(id);
	return DefaultMessages.deleteMessage;
};

export { getOfficeScheduleDatesByMonth, getOfficeSchedulesByDoctor, create, update, deleteRow };
