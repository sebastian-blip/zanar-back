import { doctorService } from '../../services/doctorService';
import { isAuthenticate } from '../../../authentication/services/authenticationService';

const updateDoctor = async (root, { doctorId, data }, context) => {
	isAuthenticate(context);
	const doctor = doctorService.update(doctorId, data, { includeAdditionalFields: true });
	return doctor;
};

export default {
	updateDoctor
};
