import { models } from '../../database/mySql';
import * as DefaultMessages from '../../utils/messages/default/default.json';

// eslint-disable-next-line camelcase
const { consulting_rooms } = models;

const getConsultingRoomsByDoctor = doctorId => {
	return consulting_rooms.findAll({ where: { doctor_id: doctorId } });
};

const create = async consultingRoomData => {
	const record = await consulting_rooms.create(consultingRoomData);
	return record.id;
};

const update = async (id, consultingRoomData) => {
	await consulting_rooms.update(consultingRoomData, { where: { id } });
	return DefaultMessages.updateMessage;
};

const deleteRow = async id => {
	await consulting_rooms.destroy({ where: { id } });
	return DefaultMessages.deleteMessage;
};

export { getConsultingRoomsByDoctor, create, update, deleteRow };
