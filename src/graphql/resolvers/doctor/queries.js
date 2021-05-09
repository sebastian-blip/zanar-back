
import { doctorService } from '../../../services/doctorService';

const getDoctor = async (root, { doctorId }) => {
    return await doctorService.get(doctorId, { includeAdditionalFields: true });
};

const getDoctors = async (root) => {
    return await doctorService.getAll();
};

export default {
    getDoctor,
    getDoctors
};