import { erp as ERPConfig } from '../../config';
import { ERPHttpClient } from './utils/erp_http_client';
import { URLS } from './utils/constants';
import moment from 'moment';

export class ERPProvider {
	constructor(urlResource) {
		this.urlResource = urlResource;
		this.httpClient = new ERPHttpClient();
		this.credentials = {
			username: ERPConfig.USERNAME,
			password: ERPConfig.PASSWORD
		};
		this.tokenInformation = {
			token: undefined,
			exp_time: moment()
		};
		this.checkToken();
	}

	async login() {
		const { token, exp_time } = await this.httpClient.get(URLS.LOGIN, this.credentials);
		this.tokenInformation = {
			token,
			exp_time: moment(exp_time)
		};
	}

	async checkToken() {
		if (
			this.tokenInformation.exp_time &&
			this.tokenInformation.exp_time.isAfter(moment().subtract(10, 'minutes'))
		) {
			try {
				await this.login();
				this.httpClient.refreshInstance({
					'access-token': this.tokenInformation.token
				});
			} catch (error) {
				error.message = `ERP Provider: ${error.message}`;
				throw error;
			}
		}
	}

	parseFilters(filters) {
		let parsedFilters = [];

		for (let field in filters) parsedFilters.push([field, 'like', filters[field]]);

		return parsedFilters;
	}

	parseElement(e) {
		return e;
	}

	parseResponse(response = {}, parseEFunction, first = true) {
		const parseElement = parseEFunction || this.parseElement;
		if (response.data) {
			if (first) {
				return parseElement(response.data[0]) || null;
			} else {
				return {
					total: response.total,
					count: response.data.length,
					page: response.current_page,
					records: response.data.map(parseElement)
				};
			}
		}
	}

	async getFirst(id) {
		await this.checkToken();

		const itemsResult = await this.httpClient.post(
			`${this.urlResource}${id}`,
			undefined,
			undefined
		);
		return this.parseResponse(itemsResult);
	}

	async getList(filters = {}, pagination = {}) {
		await this.checkToken();
		const parsedFilters = this.parseFilters(filters);
		const { page, pageSize } = pagination;

		let headers = {
			filters: JSON.stringify(parsedFilters)
		};

		if (pagination) {
			headers['current-page'] = page || 0;
			headers['records-per-page'] = pageSize || 20;
		}

		const itemsResult = await this.httpClient.post(this.urlResource, undefined, headers);

		return this.parseResponse(itemsResult, undefined, false);
	}
}

export default new ERPProvider();
