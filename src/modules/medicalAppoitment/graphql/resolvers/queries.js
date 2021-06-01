import { medicalAppoitmentService } from '../../services/medicalAppoitmentService';

const getMedicalAppoitment = async (root, { id }) => {
	return await medicalAppoitmentService.get(id, { applyAdapter: true });
};

const getMedicalAppoitments = async (root, { filters, pagination }) => {
	return await medicalAppoitmentService.getAll(filters, pagination);
};

const getDoctorScheduleByDay = async (root, { doctorId, date }) => {
	return await medicalAppoitmentService.getDoctorScheduleByDay(doctorId, date);
};

export default {
	getMedicalAppoitment,
	getMedicalAppoitments,
	getDoctorScheduleByDay
};
