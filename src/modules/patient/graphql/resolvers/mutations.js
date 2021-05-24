import { patientService } from '../../services/patientService';

const createPatient = async (root, { data }) => {
    const patient = patientService.create(data, { includeAdditionalFields: true });
	return patient;
};

const updatePatient = async (root, { patientId, data }) => {
    const patient = patientService.update(patientId, data, { includeAdditionalFields: true });
	return patient;
};

export default {
    createPatient,
    updatePatient
};
