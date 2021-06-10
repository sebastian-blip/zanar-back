import {
	getConsultingRoomsByDoctor,
	create,
	deleteRow,
	update
} from '../../services/consultingRoomService';

const consultingRoomQueries = {
	getConsultingRoomsByDoctor: (root, { doctorId }) => getConsultingRoomsByDoctor(doctorId)
};

const consultingRoomMutations = {
	createConsultingRoom: (root, { consultingRoomData }) => create(consultingRoomData),
	updateConsultingRoom: (root, { id, consultingRoomData }) => update(id, consultingRoomData),
	deleteRowConsultingRoom: (root, { id }) => deleteRow(id)
};

export { consultingRoomQueries, consultingRoomMutations };
