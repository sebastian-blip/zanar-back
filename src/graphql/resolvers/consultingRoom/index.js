import {
	getConsultingRoomsByDoctor,
	create,
	deleteRow,
	update
} from '../../../services/consultingRoom';

const consultingRoomQueries = {
	getConsultingRoomsByDoctor: (root, { doctorId }) => getConsultingRoomsByDoctor(doctorId)
};

const consultingRoomMutations = {
	createConsultingRoom: (root, { consultingRoomData }) => create(consultingRoomData),
	updateConsultingRoom: (root, { id, consultingRoomData }) => deleteRow(id, consultingRoomData),
	deleteRowConsultingRoom: (root, { id }) => update(id)
};

export { consultingRoomQueries, consultingRoomMutations };
