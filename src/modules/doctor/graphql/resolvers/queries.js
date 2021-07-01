import { doctorService } from '../../services/doctorService';
import { isAuthenticate } from '../../../authentication/services/authenticationService';

const getDoctor = async (root, { doctorId }, context) => {
	isAuthenticate(context);
	const doctor = await doctorService.get(doctorId, { includeAdditionalFields: true });
	return doctor;
};

const getDoctors = async (root, values, context) => {
	isAuthenticate(context);
	return doctorService.getAll();
};

export default {
	getDoctor,
	getDoctors
};
