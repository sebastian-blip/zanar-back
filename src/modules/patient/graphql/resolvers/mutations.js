import { patientService } from '../../services/patientService';
import { patientCompanionService } from '../../services/patientCompanionService';
import { isAuthenticate } from '../../../authentication/services/authenticationService';

const createPatient = async (root, { data }, context) => {
	isAuthenticate(context);
	const patient = patientService.create(data, { includeAdditionalFields: true });
	return patient;
};

const updatePatient = async (root, { patientId, data }, context) => {
	isAuthenticate(context);
	const patient = patientService.update(patientId, data, { includeAdditionalFields: true });
	return patient;
};

const createPatientCompanion = async (root, { patientId, data }, context) => {
	isAuthenticate(context);
	const patient = patientCompanionService.create(
		{
			...data,
			companion_of: patientId
		},
		{ includeAdditionalFields: true }
	);
	return patient;
};

const updatePatientCompanion = async (root, { patientCompanionId, data }, context) => {
	isAuthenticate(context);
	const patient = patientCompanionService.update(patientCompanionId, data, {
		includeAdditionalFields: true
	});
	return patient;
};

export default {
	createPatient,
	updatePatient,
	createPatientCompanion,
	updatePatientCompanion
};
