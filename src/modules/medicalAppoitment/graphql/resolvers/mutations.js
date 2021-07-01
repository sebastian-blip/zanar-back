import { medicalAppoitmentService } from '../../services/medicalAppoitmentService';
import { isAuthenticate } from '../../../authentication/services/authenticationService';

const createMedicalAppoitment = (root, { medicalAppoitmentData }, context) => {
	isAuthenticate(context);
	return medicalAppoitmentService.create(medicalAppoitmentData);
};

const updateMedicalAppoitment = (root, { medicalAppoitmentId, medicalAppoitmentData }, context) => {
	isAuthenticate(context);
	return medicalAppoitmentService.update(medicalAppoitmentId, medicalAppoitmentData);
};

const deleteMedicalAppoitment = (root, { medicalAppoitmentId }, context) => {
	isAuthenticate(context);
	return medicalAppoitmentService.delete(medicalAppoitmentId);
};

export default {
	createMedicalAppoitment,
	updateMedicalAppoitment,
	deleteMedicalAppoitment
};
