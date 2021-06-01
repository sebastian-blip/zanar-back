import ERPItemProvider from '../../../../providers/erp/erp_item_provider';
import ERPServiceProvider from '../../../../providers/erp/erp_service_provider';
import ERPLaboratoryProvider from '../../../../providers/erp/erp_laboratory_provider';
import ERPArticuloProvider from '../../../../providers/erp/erp_articulo_provider';

const getMedicine = async (root, { id }) => {
	return await ERPItemProvider.getMedicine(id);
};

const getMedicineList = async (root, { filters, pagination }) => {
	return await ERPItemProvider.getMedicineList(filters, pagination);
};

const getErpArticulo = async (root, { id }) => {
	return await ERPArticuloProvider.getArticulo(id);
};

const getErpArticuloList = async (root, { filters, pagination }) => {
	return await ERPArticuloProvider.getArticuloList(filters, pagination);
};

const getService = async (root, { code }) => {
	return await ERPServiceProvider.getService(code);
};

const getServiceList = async (root, { filters, pagination }) => {
	return await ERPServiceProvider.getServiceList(filters, pagination);
};

const getLaboratory = async (root, { code }) => {
	return await ERPLaboratoryProvider.getLaboratory(code);
};

const getLaboratoryList = async (root, { filters, pagination }) => {
	return await ERPLaboratoryProvider.getLaboratoryList(filters, pagination);
};

export default {
	getMedicine,
	getMedicineList,
	getErpArticulo,
	getErpArticuloList,
	getService,
	getServiceList,
	getLaboratory,
	getLaboratoryList
};
