import { medicalAppoitmentService } from '../../services/medicalAppoitmentService';

const createMedicalAppoitment = async (root, { medicalAppoitmentData }) => {
	return await medicalAppoitmentService.create(medicalAppoitmentData);
};

const updateMedicalAppoitment = async (root, { medicalAppoitmentId, medicalAppoitmentData }) => {
	return await medicalAppoitmentService.update(medicalAppoitmentId, medicalAppoitmentData);
};

const deleteMedicalAppoitment = async (root, { medicalAppoitmentId }) => {
	return await medicalAppoitmentService.delete(medicalAppoitmentId);
};

export default {
	createMedicalAppoitment,
	updateMedicalAppoitment,
	deleteMedicalAppoitment
};
