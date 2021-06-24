import { patientService } from '../../services/patientService';
import { patientCompanionService } from '../../services/patientCompanionService';

const getPatient = async (root, { patientId }) => {
	const patient = await patientService.get(patientId, { includeAdditionalFields: true });
	return patient;
};

const getPatients = async (root, { filters, pagination }) => {
	return patientService.getAllPatientByDocumentAndName(filters, pagination);
};

const getPatientCompanion = async (root, { patientId }) => {
	const patient = await patientCompanionService.get(patientId, {
		includeAdditionalFields: true,
		getByPatientId: true
	});
	return patient;
};

export default {
	getPatient,
	getPatients,
	getPatientCompanion
};
