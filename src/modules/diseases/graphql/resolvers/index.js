import * as diseasesService from '../../service/diseasesService';
import { isAuthenticate } from '../../../authentication/services/authenticationService';

const diseasesQueries = {
	getDiseases: (root, { filter, pagination }, context) => {
		isAuthenticate(context);
		return diseasesService.getDiseases(filter, pagination);
	}
};

const diseasesMutations = {};

export { diseasesQueries, diseasesMutations };
