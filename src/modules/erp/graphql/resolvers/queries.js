// eslint-disable-next-line import/no-named-as-default
import ERPItemProvider from '../../../../providers/erp/erp_item_provider';
// eslint-disable-next-line import/no-named-as-default
import ERPServiceProvider from '../../../../providers/erp/erp_service_provider';
// eslint-disable-next-line import/no-named-as-default
import ERPLaboratoryProvider from '../../../../providers/erp/erp_laboratory_provider';
// eslint-disable-next-line import/no-named-as-default
import ERPArticuloProvider from '../../../../providers/erp/erp_articulo_provider';
import { isAuthenticate } from '../../../authentication/services/authenticationService';

const getMedicine = (root, { id }, context) => {
	isAuthenticate(context);
	return ERPItemProvider.getMedicine(id);
};

const getMedicineList = (root, { filters, pagination }, context) => {
	isAuthenticate(context);
	return ERPItemProvider.getMedicineList(filters, pagination);
};

const getErpArticulo = (root, { id }, context) => {
	isAuthenticate(context);
	return ERPArticuloProvider.getArticulo(id);
};

const getErpArticuloList = (root, { filters, pagination }, context) => {
	isAuthenticate(context);
	return ERPArticuloProvider.getArticuloList(filters, pagination);
};

const getService = (root, { code }, context) => {
	isAuthenticate(context);
	return ERPServiceProvider.getService(code);
};

const getServiceList = (root, { filters, pagination }, context) => {
	isAuthenticate(context);
	return ERPServiceProvider.getServiceList(filters, pagination);
};

const getLaboratory = (root, { code }, context) => {
	isAuthenticate(context);
	return ERPLaboratoryProvider.getLaboratory(code);
};

const getLaboratoryList = (root, { filters, pagination }, context) => {
	isAuthenticate(context);
	return ERPLaboratoryProvider.getLaboratoryList(filters, pagination);
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
