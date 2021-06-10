import { serviceProviderEPSDao } from '../dao/epsDao';

const getServiceProviderEPS = async () => {
	const result = await serviceProviderEPSDao.getAll();
	return result.records;
};

// eslint-disable-next-line import/prefer-default-export
export { getServiceProviderEPS };
