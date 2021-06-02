import { sequelize as Connection } from '../../../database/mySql';
import { consultingRoomsDao } from '../dao/consultingRoomDao';
import { validHours } from '../../../utils/validate/time/timeValidate';
import * as DefaultMessages from '../../../utils/messages/default/default.json';

const getConsultingRoomsByDoctor = async doctorId => {
	const result = await consultingRoomsDao.getAll({ doctor_id: doctorId });
	return result.records;
};

const create = async consultingRoomData => {
	validHours(consultingRoomData);
	const record = await consultingRoomsDao.create(consultingRoomData);
	return record.id;
};

const update = async (id, consultingRoomData) => {
	const transaction = { transaction: await Connection.transaction() };
	try {
		const record = await consultingRoomsDao.update(id, consultingRoomData, transaction);
		validHours(record);
		await transaction.transaction.commit();
		return DefaultMessages.updateMessage;
	} catch (error) {
		await transaction.transaction.rollback();
		throw error;
	}
};

const deleteRow = async id => {
	await consultingRoomsDao.delete(id);
	return DefaultMessages.deleteMessage;
};

export { getConsultingRoomsByDoctor, create, update, deleteRow };
