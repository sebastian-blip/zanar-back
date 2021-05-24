import { patientService } from '../../services/patientService';

const getPatient = async (root, { patientId }) => {
	const patient = await patientService.get(patientId, { includeAdditionalFields: true });
	return patient;
};

const getPatients = async (root, { filters, pagination }) => {
	return await patientService.getAll(filters, pagination);
};

export default {
	getPatient,
	getPatients
};
