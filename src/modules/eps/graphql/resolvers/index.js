import * as epsService from '../../service/epsService';

const epsQueries = {
	getServiceProviderEPS: () => epsService.getServiceProviderEPS()
};

const epsMutations = {};

export { epsQueries, epsMutations };
