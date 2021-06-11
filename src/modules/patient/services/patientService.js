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
				required: true,
				where: {
					is_doctor: false
				}
			},
			{
				model: Models.TypeDocument,
				as: 'documentType',
				required: false
			},
			{
				model: Models.ServiceProviderEPS,
				as: 'serviceProviderEPS',
				required: false
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
		if (!patient || patient.contact?.is_doctor == true || patient.roles[0].name != ROLES.PATIENT)
			throw new ApolloError(`${this.modelLabel} not found`, `${this.modelLabel}FindError`);

		return patient;
	}

	async getByNationalId(nationalId, opts = {}) {
		const query = {
			...opts,
			paranoid: false,
			include: this.getIncludeQuery(),
			where: {
				national_id: nationalId,
				[Sequelize.Op.and]: [Sequelize.where(Sequelize.col('roles.name'), ROLES.PATIENT)]
			},
			subQuery: false
		};
		return await this.model.findOne(query);
	}

	async create(data, opts) {
		if (await this.getByNationalId(data.national_id.trim()))
			throw new ApolloError(`${this.modelLabel} already exists`, `${this.modelLabel}FindError`);

		return await super.create(
			{
				...(await this.inputAdapter(data)),
				roleName: ROLES.PATIENT
			},
			opts
		);
	}

	async update(patientId, data, opts) {
		const patient = await this.get(patientId);
		const anotherPatient = await this.getByNationalId(data.national_id.trim());
		
		if (data.national_id && anotherPatient && patient.id != anotherPatient.id) {
			throw new ApolloError(`${this.modelLabel} already exists`, `${this.modelLabel}FindError`);
		}

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
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < result.records.length; i++) {
			// eslint-disable-next-line no-await-in-loop
			result.records[i].additionalFields = await this.getAdditionalFieldsByContactId(
				result.records[i].contact.id
			);
		}
		result.records = result.records.map(r => this.outputAdapter(r));

		return result;
	}
}

export const patientService = new PatientService();

export default PatientService;
