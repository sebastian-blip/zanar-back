import { ERPProvider } from './erp_provider';
import { URLS, defaultResponse } from './utils/constants';

export class ERPLaboratoryProvider extends ERPProvider {
	constructor() {
		super(URLS.LABORATORIES);
	}

	async getLaboratory(code) {
		await this.checkToken();

		const itemsResult = await this.httpClient.post(this.urlResource, undefined, {
			filters: JSON.stringify([['code', '=', code]])
		});

		return this.parseResponse(itemsResult);
	}

	async getLaboratoryList(filters = {}, pagination) {
		const result = await this.getList(filters, pagination);
		return result || defaultResponse;
	}
}

export default new ERPLaboratoryProvider();
