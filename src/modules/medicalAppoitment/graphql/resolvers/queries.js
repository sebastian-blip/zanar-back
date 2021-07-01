import { medicalAppoitmentService } from '../../services/medicalAppoitmentService';
import { isAuthenticate } from '../../../authentication/services/authenticationService';

const getMedicalAppoitment = (root, { id }, context) => {
	isAuthenticate(context);
	return medicalAppoitmentService.get(id, { applyAdapter: true });
};

const getMedicalAppoitments = (root, { filters, pagination }, context) => {
	isAuthenticate(context);
	return medicalAppoitmentService.getAll(filters, pagination);
};

const getDoctorScheduleByDay = (root, { doctorId, date }, context) => {
	isAuthenticate(context);
	return medicalAppoitmentService.getDoctorScheduleByDay(doctorId, date);
};

export default {
	getMedicalAppoitment,
	getMedicalAppoitments,
	getDoctorScheduleByDay
};
