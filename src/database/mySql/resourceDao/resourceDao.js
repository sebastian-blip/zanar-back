import { ApolloError } from 'apollo-server-errors';

export default class ResourceDao {
	constructor(model, modelLabel) {
		this.model = model;
		this.modelLabel = modelLabel;
	}

	// eslint-disable-next-line class-methods-use-this
	calcPagination(page = 0, pageSize = 20) {
		return {
			limit: pageSize,
			offset: page * pageSize
		};
	}

	setModel(model, modelLabel) {
		this.model = model;
		this.modelLabel = modelLabel;
	}

	// eslint-disable-next-line class-methods-use-this
	getIncludeQuery() {
		return [];
	}

	// eslint-disable-next-line class-methods-use-this
	parseFilters(filters) {
		return filters;
	}

	async create(data, optQuery = {}) {
		try {
			const record = await this.model.create(data, optQuery);
			return record;
		} catch (error) {
			throw new ApolloError(
				`The ${this.modelLabel} could not be created`,
				`${this.modelLabel}CreateError`,
				error
			);
		}
	}

	async get(id, optQuery = {}) {
		const query = {
			include: this.getIncludeQuery(),
			paranoid: false,
			...optQuery
		};
		const record = this.model.findByPk(id, query);
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

	async findOrCreate(defaults, where, optQuery = {}) {
		return this.model.findOrCreate({
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

	async getAll(filters = {}, pagination = { page: 0, pageSize: 100 }) {
		let query = {
			include: this.getIncludeQuery(),
			where: this.parseFilters(filters),
			paranoid: true
		};

		if (pagination)
			query = {
				...query,
				...this.calcPagination(pagination.page, pagination.pageSize)
			};
		const total = await this.model.count(query);
		const records = await this.model.findAll(query);
		const response = {
			total,
			count: records.length,
			page: pagination ? pagination.page : 0,
			records
		};
		return response;
	}
}
