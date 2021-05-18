import { doctorService } from '../../services/doctorService';

const getDoctor = async (root, { doctorId }) => {
	const doctor = await doctorService.get(doctorId, { includeAdditionalFields: true });
    return doctor;
};

const getDoctors = async root => {
	return await doctorService.getAll();
};

export default {
	getDoctor,
	getDoctors
};
