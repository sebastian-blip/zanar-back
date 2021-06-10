import { doctorService } from '../../services/doctorService';

const updateDoctor = async (root, { doctorId, data }) => {
    const doctor = doctorService.update(doctorId, data, { includeAdditionalFields: true });
	return doctor;
};

export default {
    updateDoctor
};
