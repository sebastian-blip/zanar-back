import Sequelize from 'sequelize';
import { ApolloError } from 'apollo-server-errors';
import Models, { sequelize as Connection, sequelize } from '../../../database/mySql';
import ROLES from '../../user/utils/roleConstants';
import { UserService } from '../../user/services/userService.js';

export class PatientService extends UserService {
	constructor() {
		super('Patient', 'contacts');
	}

	getIncludeQuery() {
		return [
			{
				model: Models.Role,
				as: 'roles',
				required: true
			},
			{
				model: Models.Contact,
				as: 'contact',
				required: true
			}
		];
	}

	async get(patientId, opts) {
		const patient = await super.get(patientId, {
			...opts
			//adapter: this.adapter.bind(this)
		});
		if (!patient || (patient.contact?.is_doctor == true && patient.roles[0].name == ROLES.PATIENT))
			throw new ApolloError(`${this.modelLabel} not found`, `${this.modelLabel}FindError`);

		return patient;
	}

	async create(data, opts) {
		return await super.create({
			...data,
			roleName: ROLES.PATIENT
		}, opts);
	}

	parseFilters(filters) {
		let parsedFilters = { ...filters };

		if (parsedFilters.national_id)
			parsedFilters.national_id = { [Sequelize.Op.like]: `%${filters.national_id}%` };

		return parsedFilters;
	}

	async getAll(filters = {}, pagination = { page: 0, pageSize: 100 }) {
		const result = await super.getAll(
			{
				[Sequelize.Op.and]: [Sequelize.where(Sequelize.col('contact.is_doctor'), false)],
				...filters
			},
			pagination
		);
		return result;
	}
}

export const patientService = new PatientService();

export default PatientService;
