import { sequelize } from '../../database/mySql';
import * as DefaultMessages from '../../utils/messages/default/default.json';

// eslint-disable-next-line camelcase
const { consulting_rooms } = sequelize.models;

const getConsultingRoomsByDoctor = (root, { doctorId }) => {
	return consulting_rooms.findAll({ where: { doctor_id: doctorId } });
};

const create = async (root, { consultingRoomData }) => {
	const record = await consulting_rooms.create(consultingRoomData);
	return record.id;
};

const update = async (root, { id, consultingRoomData }) => {
	await consulting_rooms.update(consultingRoomData, { where: { id } });
	return DefaultMessages.updateMessage;
};

const deleteRow = async (root, { id }) => {
	await consulting_rooms.destroy({ where: { id } });
	return DefaultMessages.deleteMessage;
};

export { getConsultingRoomsByDoctor, create, update, deleteRow };
