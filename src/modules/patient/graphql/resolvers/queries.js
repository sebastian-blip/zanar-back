import { patientService } from '../../services/patientService';
import { patientCompanionService } from '../../services/patientCompanionService';
import { isAuthenticate } from '../../../authentication/services/authenticationService';

const getPatient = async (root, { patientId }, context) => {
	isAuthenticate(context);
	const patient = await patientService.get(patientId, { includeAdditionalFields: true });
	return patient;
};

const getPatients = async (root, { filters, pagination }, context) => {
	isAuthenticate(context);
	return patientService.getAllPatientByDocumentAndName(filters, pagination);
};

const getPatientCompanion = async (root, { patientId }, context) => {
	isAuthenticate(context);
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
