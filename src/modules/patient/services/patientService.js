import Sequelize from 'sequelize';
import moment from 'moment';
import { ApolloError } from 'apollo-server-errors';
import Models, { sequelize as Connection, sequelize } from '../../../database/mySql';
import ROLES from '../../user/utils/roleConstants';
import { UserService } from '../../user/services/userService.js';

export class PatientService extends UserService {
	constructor() {
		super('Patient', 'contacts');
		this.patientAdditionalFields = {
			birthday: 'date_contact_cumple',
			gender: 'text_contact_gender'
		};
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

	async inputAdapter(data) {
		if (!data.additionalFields) data.additionalFields = [];

		const allAdditionalFieldKeys = await this.getAdditionalFieldsOfModule();
		allAdditionalFieldKeys.forEach(key => {
			const keyName = key.additional_field_key_name.trim().toLowerCase();
			const buildNewElement = (key, value) => {
				return {
					additional_field_key_id: key.id,
					additional_field_values: value
				};
			};

			if (data.birthday && keyName == this.patientAdditionalFields.birthday) {
				data.additionalFields.push(
					buildNewElement(key, moment(data.birthday).format('YYYY-MM-DD'))
				);
			} else if (data.gender && keyName == this.patientAdditionalFields.gender) {
				data.additionalFields.push(buildNewElement(key, data.gender));
			}
		});
		return data;
	}

	outputAdapter(patient) {
		let newFormat = patient;

		newFormat.birthday = this.getAdditionalFieldByKeyName(
			patient.additionalFields || [],
			this.patientAdditionalFields.birthday
		);

		newFormat.gender = this.getAdditionalFieldByKeyName(
			patient.additionalFields || [],
			this.patientAdditionalFields.gender
		);

		return newFormat;
	}

	async get(patientId, opts) {
		const patient = await super.get(patientId, {
			...opts,
			adapter: this.outputAdapter.bind(this)
		});
		if (!patient || (patient.contact?.is_doctor == true && patient.roles[0].name == ROLES.PATIENT))
			throw new ApolloError(`${this.modelLabel} not found`, `${this.modelLabel}FindError`);

		return patient;
	}

	async create(data, opts) {
		return await super.create(
			{
				...(await this.inputAdapter(data)),
				roleName: ROLES.PATIENT
			},
			opts
		);
	}

	async update(patientId, data, opts) {
		return await super.update(
			patientId,
			{
				...(await this.inputAdapter(data))
			},
			opts
		);
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

		result.records = result.records.map(r => this.outputAdapter(r));

		return result;
	}
}

export const patientService = new PatientService();

export default PatientService;
