import moment from 'moment';
import { ApolloError } from 'apollo-server-errors';
import Models, { sequelize as Connection, sequelize } from '../../../database/mySql';
import ROLES from '../../user/utils/roleConstants';
import { UserService } from '../../user/services/userService.js';
import { patientService } from './patientService';

export class PatientCompanionService extends UserService {
	constructor() {
		super('PatientCompanion', 'contacts');
		this.patientAdditionalFields = {
			birthday: 'date_contact_cumple',
			gender: 'text_contact_gender'
		};
	}

	getIncludeQuery() {
		return [
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

	async get(id, opts) {
		let patientCompanionId = id;

		if (opts.getByPatientId) {
			const patient = await patientService.get(id);
			patientCompanionId = patient.companion;
		}

		const patientCompanion = await super.get(patientCompanionId, {
			...opts,
			adapter: this.outputAdapter.bind(this)
		});

		if (!patientCompanion || patientCompanion.contact?.is_doctor == true)
			throw new ApolloError(`${this.modelLabel} not found`, `${this.modelLabel}FindError`);

		return patientCompanion;
	}

	async create(data, opts) {
		let transaction;
		let companion = undefined;
		try {
			transaction = opts.transaction || (await Connection.transaction());

			const patient = await patientService.get(data.companion_of, { transaction });

			if (!patient) throw new ApolloError(`Patient not found`, `${this.modelLabel}FindError`);

			if (patient.companion) {
				companion = await this.update(patient.companion, data, { ...opts, transaction });
			} else {
				companion = await super.create(
					{
						...(await this.inputAdapter(data)),
						roleName: ROLES.PATIENT
					},
					{
						...opts,
						transaction
					}
				);

				await patientService.update(
					patient.id,
					{
						companion: companion.id
					},
					{ transaction }
				);
			}
			if (!opts.transaction) transaction.commit();
		} catch (error) {
			if (transaction && !opts.transaction) {
				transaction.rollback(error);
			}

			throw error;
		}

		return companion;
	}

	async update(patientCompanionId, data, opts) {
		return await super.update(patientCompanionId, await this.inputAdapter(data), opts);
	}
}

export const patientCompanionService = new PatientCompanionService();

export default PatientCompanionService;
