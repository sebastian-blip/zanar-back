import { ERPProvider } from './erp_provider';
import { URLS, defaultResponse } from './utils/constants';

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

	async getServiceList(filters = {}, pagination) {
		const result = await this.getList(filters, pagination);
		return result || defaultResponse;
	}
}

export default new ERPServiceProvider();
