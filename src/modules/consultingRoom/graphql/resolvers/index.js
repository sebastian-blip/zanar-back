import {
	getConsultingRoomsByDoctor,
	create,
	deleteRow,
	update
} from '../../services/consultingRoomService';
import { isAuthenticate } from '../../../authentication/services/authenticationService';

const consultingRoomQueries = {
	getConsultingRoomsByDoctor: (root, { doctorId }, context) => {
		isAuthenticate(context);
		return getConsultingRoomsByDoctor(doctorId);
	}
};

const consultingRoomMutations = {
	createConsultingRoom: (root, { consultingRoomData }, context) => {
		isAuthenticate(context);
		return create(consultingRoomData);
	},
	updateConsultingRoom: (root, { id, consultingRoomData }, context) => {
		isAuthenticate(context);
		return update(id, consultingRoomData);
	},
	deleteRowConsultingRoom: (root, { id }, context) => {
		isAuthenticate(context);
		return deleteRow(id);
	}
};

export { consultingRoomQueries, consultingRoomMutations };
