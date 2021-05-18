import { consultingRoomsDao } from '../dao/consultingRoomDao';
import * as DefaultMessages from '../../../utils/messages/default/default.json';

const getConsultingRoomsByDoctor = async doctorId => {
	const result = await consultingRoomsDao.getAll({ doctor_id: doctorId });
	return result.records;
};

const create = async consultingRoomData => {
	const record = await consultingRoomsDao.create(consultingRoomData);
	return record.id;
};

const update = async (id, consultingRoomData) => {
	await consultingRoomsDao.update(id, consultingRoomData);
	return DefaultMessages.updateMessage;
};

const deleteRow = async id => {
	await consultingRoomsDao.delete(id);
	return DefaultMessages.deleteMessage;
};

export { getConsultingRoomsByDoctor, create, update, deleteRow };
