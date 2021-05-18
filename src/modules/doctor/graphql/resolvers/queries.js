import { doctorService } from '../../services/doctorService';

const getDoctor = async (root, { doctorId }) => {
	return doctorService.get(doctorId, { includeAdditionalFields: true });
};

const getDoctors = async root => {
	return doctorService.getAll();
};

export default {
	getDoctor,
	getDoctors
};
