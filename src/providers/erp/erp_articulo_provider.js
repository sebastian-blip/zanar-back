import { ERPProvider } from './erp_provider';
import { URLS, defaultResponse } from './utils/constants';

export class ERPArticuloProvider extends ERPProvider {
	constructor() {
		super(URLS.ARTICULOS);
	}

	async getArticulo(id) {
		return await this.getFirst(id);
	}

	async getArticuloList(filters = {}, pagination) {
		const result = await this.getList(filters, pagination);
		return result || defaultResponse;
	}
}

export default new ERPArticuloProvider();
