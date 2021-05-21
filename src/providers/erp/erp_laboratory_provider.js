import { ERPProvider } from './erp_provider';
import { URLS } from './utils/constants';

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

	async getLaboratoryList(filters = {}) {
		return await this.getList(filters);
	}
}

export default new ERPLaboratoryProvider();
