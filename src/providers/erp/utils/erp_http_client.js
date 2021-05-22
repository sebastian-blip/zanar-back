import { erp as ERPConfig } from '../../../config';
import axios from 'axios';
import _ from 'lodash';

export class ERPHttpClient {
	constructor() {
		this.host = ERPConfig.HOST;
		this.axios = axios.create({
			baseURL: this.cleanUrl(this.host),
			timeout: ERPConfig.TIMEOUT
		});
	}

	refreshInstance(headers) {
		Object.keys(headers).forEach(key => {
			this.axios.defaults.headers.common[key] = headers[key];
		});
	}

	cleanUrl(url) {
		url = _.trim(url, '/') + '/';
		return url;
	}

	async sendRequest(method, url, config) {
		return (
			await this.axios.request({
				method,
				url,
				...config
			})
		).data;
	}

	async get(url, params = undefined, headers = {}) {
		return await this.sendRequest('get', this.cleanUrl(url), { params, headers });
	}

	async post(url, data = undefined, headers = {}) {
		return await this.sendRequest('post', this.cleanUrl(url), { data, headers });
	}

	async put(url, data = undefined, headers = {}) {
		return await this.sendRequest('put', this.cleanUrl(url), { data, headers });
	}
}

export default new ERPHttpClient();
