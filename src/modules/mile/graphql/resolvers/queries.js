import { mileForSaleService } from '../../services/mileForSaleService';

const getMile = async (root, { id }) => {
	const mile = await mileForSaleService.get(id);
	return mile;
};

const getMiles = async (root, { filters, pagination }) => {
	return await mileForSaleService.getAll(filters, pagination);
};

const getFormulaMiles = async (root, { filters, pagination }) => {
	return await mileForSaleService.getMilesGroupedByMedicalFormula(filters, pagination);
};

const getMileReport = async (root, { doctorId, date }) => {
	return await mileForSaleService.getReport(doctorId, date);
};

export default {
	getMile,
	getMiles,
	getFormulaMiles,
	getMileReport
};
