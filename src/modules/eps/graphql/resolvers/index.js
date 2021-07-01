import * as epsService from '../../service/epsService';
import { isAuthenticate } from '../../../authentication/services/authenticationService';

const epsQueries = {
	getServiceProviderEPS: (root, values, context) => {
		isAuthenticate(context);
		return epsService.getServiceProviderEPS();
	}
};

const epsMutations = {};

export { epsQueries, epsMutations };
