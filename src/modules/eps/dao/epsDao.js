import Models from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';

export default class ServiceProviderEPSDao extends ResourceDao {
	constructor() {
		super(Models.ServiceProviderEPS, 'ServiceProviderEPS');
	}
}

const serviceProviderEPSDao = new ServiceProviderEPSDao();

export { serviceProviderEPSDao };
