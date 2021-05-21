import ERPItemProvider from '../../../../providers/erp/erp_item_provider';
import ERPServiceProvider from '../../../../providers/erp/erp_service_provider';
import ERPLaboratoryProvider from '../../../../providers/erp/erp_laboratory_provider';

const getMedicine = async (root, { id }) => {
	return await ERPItemProvider.getMedicine(id);
};

const getMedicineList = async (root, { filters }) => {
	return await ERPItemProvider.getMedicineList(filters);
};

const getService = async (root, { code }) => {
	return await ERPServiceProvider.getService(code);
};

const getServiceList = async (root, { filters }) => {
	return await ERPServiceProvider.getServiceList(filters);
};

const getLaboratory = async (root, { code }) => {
	return await ERPLaboratoryProvider.getLaboratory(code);
};

const getLaboratoryList = async (root, { filters }) => {
	return await ERPLaboratoryProvider.getLaboratoryList(filters);
};

export default {
	getMedicine,
	getMedicineList,
	getService,
	getServiceList,
	getLaboratory,
	getLaboratoryList
};
