import { medicalAppoitmentService } from '../../services/medicalAppoitmentService';

const getMedicalAppoitment = async (root, { id }) => {
	return await medicalAppoitmentService.get(id, { applyAdapter: true });
};

const getMedicalAppoitments = async (root, { filters, pagination }) => {
	return await medicalAppoitmentService.getAll(filters, pagination);
};

export default {
	getMedicalAppoitment,
	getMedicalAppoitments
};
