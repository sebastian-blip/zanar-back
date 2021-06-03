import { patientService } from '../../services/patientService';
import { patientCompanionService } from '../../services/patientCompanionService';

const getPatient = async (root, { patientId }) => {
	const patient = await patientService.get(patientId, { includeAdditionalFields: true });
	return patient;
};

const getPatients = async (root, { filters, pagination }) => {
	return await patientService.getAll(filters, pagination);
};

const getPatientCompanion = async (root, { patientCompanionId }) => {
	const patient = await patientCompanionService.get(patientCompanionId, {
		includeAdditionalFields: true
	});
	return patient;
};

export default {
	getPatient,
	getPatients,
	getPatientCompanion
};
