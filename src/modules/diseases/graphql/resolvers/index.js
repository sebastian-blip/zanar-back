import * as diseasesService from '../../service/diseasesService';

const diseasesQueries = {
	getDiseases: (root, { filter, pagination }) => {
		return diseasesService.getDiseases(filter, pagination);
	}
};

const diseasesMutations = {};

export { diseasesQueries, diseasesMutations };
