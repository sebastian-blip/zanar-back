import { ApolloError } from 'apollo-server-errors';

function calcPagination(page = 0, pageSize = 20) {
	return {
		limit: pageSize,
		offset: page * pageSize
	};
}

export default class ResourceService {
	constructor(Model, modelLabel) {
		this.Model = Model;
		this.modelLabel = modelLabel;
	}

	setModel(Model, modelLabel) {
		this.Model = Model;
		this.modelLabel = modelLabel;
	}

	// eslint-disable-next-line class-methods-use-this
	getIncludeQuery() {
		return [];
	}

	async create(data, optQuery = {}) {
		const record = await this.Model.create(data, optQuery);
		return record;
	}

	async get(id, optQuery = {}) {
		const query = {
			include: await this.getIncludeQuery(),
			paranoid: false,
			...optQuery
		};
		const record = this.Model.findByPk(id, query);
		return record;
	}

	async update(id, data, optQuery = {}) {
		const record = await this.get(id, { ...optQuery, paranoid: true });
		if (!record)
			throw new ApolloError(`${this.modelLabel} not found`, `${this.modelLabel}UpdateError`);

		await record.update(data, optQuery);
		await record.reload(optQuery);

		return record;
	}

	findOrCreate(defaults, where, optQuery = {}) {
		return this.Model.findOrCreate({
			where,
			defaults,
			...optQuery
		});
	}

	async delete(id, optQuery = {}) {
		const record = await this.get(id, { ...optQuery, paranoid: true });
		if (!record)
			throw new ApolloError(`${this.modelLabel} not found`, `${this.modelLabel}DeleteError`);

		record.destroy(optQuery);
		return record;
	}

	// eslint-disable-next-line class-methods-use-this
	parseFilters(filters) {
		return filters;
	}

	async getAll(filters = {}, pagination = { page: 0, pageSize: 100 }) {
		let query = {
			include: await this.getIncludeQuery(),
			where: this.parseFilters(filters),
			paranoid: true
		};

		if (pagination)
			query = {
				...query,
				...calcPagination(pagination.page, pagination.pageSize)
			};
		const total = await this.Model.count(query);
		const records = await this.Model.findAll(query);
		const response = {
			total,
			count: records.length,
			page: pagination ? pagination.page : 0,
			records
		};
		return response;
	}
}
