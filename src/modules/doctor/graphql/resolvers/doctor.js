import { doctorService } from '../../services/doctorService';

const additionalFields = async root => {
	return await doctorService.getAdditionalFieldsByContactId(root.contact?.id);
};

export default {
    additionalFields
}