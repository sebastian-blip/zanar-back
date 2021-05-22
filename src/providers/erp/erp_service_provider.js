import { ERPProvider } from './erp_provider';
import { URLS } from './utils/constants';

export class ERPServiceProvider extends ERPProvider {
	constructor() {
		super(URLS.SERVICES);
	}

	async getService(code) {
		await this.checkToken();

		const itemsResult = await this.httpClient.post(this.urlResource, undefined, {
			filters: JSON.stringify([['code', '=', code]])
		});

		return this.parseResponse(itemsResult);
	}

	async getServiceList(filters = {}) {
		return await this.getList(filters);
	}
}

export default new ERPServiceProvider();
