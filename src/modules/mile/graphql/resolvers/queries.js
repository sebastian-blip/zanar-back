import { mileForSaleService } from '../../services/mileForSaleService';
import { isAuthenticate } from '../../../authentication/services/authenticationService';

const getMile = async (root, { id }, context) => {
	isAuthenticate(context);
	const mile = await mileForSaleService.get(id);
	return mile;
};

const getMiles = async (root, { filters, pagination }, context) => {
	isAuthenticate(context);
	return mileForSaleService.getAll(filters, pagination);
};

const getFormulaMiles = async (root, { filters, pagination }, context) => {
	isAuthenticate(context);
	return mileForSaleService.getMilesGroupedByMedicalFormula(filters, pagination);
};

const getMileReport = async (root, { filters }, context) => {
	isAuthenticate(context);
	return mileForSaleService.getReport(filters);
};

export default {
	getMile,
	getMiles,
	getFormulaMiles,
	getMileReport
};
