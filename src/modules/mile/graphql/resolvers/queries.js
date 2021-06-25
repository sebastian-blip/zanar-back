import { mileForSaleService } from '../../services/mileForSaleService';

const getMile = async (root, { id }) => {
	const mile = await mileForSaleService.get(id);
	return mile;
};

const getMiles = async (root, { filters, pagination }) => {
	return mileForSaleService.getAll(filters, pagination);
};

const getFormulaMiles = async (root, { filters, pagination }) => {
	return mileForSaleService.getMilesGroupedByMedicalFormula(filters, pagination);
};

const getMileReport = async (root, { filters }) => {
	return mileForSaleService.getReport(filters);
};

export default {
	getMile,
	getMiles,
	getFormulaMiles,
	getMileReport
};
