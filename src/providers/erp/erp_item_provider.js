import { ERPProvider } from './erp_provider';
import { URLS, defaultResponse } from './utils/constants';

export class ERPItemProvider extends ERPProvider {
	constructor() {
		super(URLS.ITEMS);
	}

	parseFilters(filters) {
		const realFieldNames = {
			name: 'name',
			default_code: 'default_code',
			descripcion_generica: 'x_farma_descripcion_generica',
			nombre_laboratorio: 'x_farma_nombre_laboratorio',
			segundo_nombre_laboratorio: 'x_farma_tercero_laboratorio',
			forma_farmaceutica: 'x_farma_forma_farmaceutica'
		};

		let parsedFilters = [];

		for (let field in filters) parsedFilters.push([realFieldNames[field], 'like', filters[field]]);

		return parsedFilters;
	}

	parseElement(item) {
		return {
			id: item['id'],
			name: item['name'],
			default_code: item['default_code'],
			descripcion_generica: item['x_farma_descripcion_generica'],
			nombre_laboratorio: item['x_farma_nombre_laboratorio'],
			segundo_nombre_laboratorio: item['x_farma_tercero_laboratorio'],
			forma_farmaceutica: item['x_farma_forma_farmaceutica'],
			price: item['price'],
			x_farma_controlado: item['x_farma_controlado']
		};
	}

	async getMedicine(id) {
		return await this.getFirst(id);
	}

	async getMedicineList(filters = {}, pagination) {
		const result = await this.getList(filters, pagination);
		return result || defaultResponse;
	}
}

export default new ERPItemProvider();
