import {
	getConsultingRoomsByDoctor,
	create,
	deleteRow,
	update
} from '../../../services/consultingRoom';

const consultingRoomQueries = {
	getConsultingRoomsByDoctor
};

const consultingRoomMutations = {
	createConsultingRoom: create,
	updateConsultingRoom: update,
	deleteRowConsultingRoom: deleteRow
};

export { consultingRoomQueries, consultingRoomMutations };
