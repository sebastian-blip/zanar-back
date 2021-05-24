import { patientService } from '../../services/patientService';

const additionalFields = async root => {
	return await patientService.getAdditionalFieldsByContactId(root.contact?.id);
};

export default {
    //additionalFields
}