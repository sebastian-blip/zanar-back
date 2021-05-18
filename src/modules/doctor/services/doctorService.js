import Sequelize from 'sequelize';
import { ApolloError } from 'apollo-server-errors';
import ResourceService from '../../../database/mySql/resourceService/resourceService';
import Models, { sequelize as Connection, sequelize } from '../../../database/mySql';
import { contactService } from '../../contact/services/contactService';

class DoctorService extends ResourceService {
	constructor() {
		const upportModule = 'doctors';
		super(Models.User, 'Doctor', upportModule);
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

	getAdditionalFieldByKeyName(additionalFields, name) {
		const additionalField = additionalFields.find(
			additionalField => additionalField.additional_field_key_name === name
		);
		return additionalField.additional_field_values || '';
	}

	async get(doctorId, opts) {
		const doctor = await super.get(doctorId);
		if (!doctor || !doctor?.contact?.is_doctor)
			throw new ApolloError(`${this.modelLabel} not found`, `${this.modelLabel}FindError`);
		if (opts?.includeAdditionalFields) {
			doctor.additionalFields = await this.getAdditionalFieldsByContactId(doctor.contact.id);
		}

		return doctor;
	}

	async getCustom(doctorId) {
		const doctor = await this.get(doctorId, { includeAdditionalFields: true });
		const additionalFields = doctor.additionalFields || [];

		const sex = this.getAdditionalFieldByKeyName(additionalFields, 'text_Doctor_gender');
		const birthday = this.getAdditionalFieldByKeyName(additionalFields, 'date_Doctor_birthday');
		const instagram = this.getAdditionalFieldByKeyName(additionalFields, 'text_Doctor_instagram');
		const facebook = this.getAdditionalFieldByKeyName(additionalFields, 'text_Doctor_facebook');
		const twitter = this.getAdditionalFieldByKeyName(additionalFields, 'text_Doctor_twitter');

		const specialization = this.getAdditionalFieldByKeyName(
			additionalFields,
			'text_Doctor_specialty'
		);
		const specializationUniversity = this.getAdditionalFieldByKeyName(
			additionalFields,
			'text_Doctor_university'
		);
		const specializationYear = this.getAdditionalFieldByKeyName(
			additionalFields,
			'text_Doctor_year_degree'
		);
		const subspecialization = this.getAdditionalFieldByKeyName(
			additionalFields,
			'text_Doctor_subspecialty'
		);
		const subspecializationUniversity = this.getAdditionalFieldByKeyName(
			additionalFields,
			'text_Doctor_university_subspecialty'
		);
		const subspecializationYear = this.getAdditionalFieldByKeyName(
			additionalFields,
			'text_Doctor_year_degree_subspecialty'
		);

		return {
			name: doctor.name,
			lastNames: '',
			sex,
			phone: doctor.phone,
			birthday,
			email: doctor.email,
			address: doctor.address,
			education: [
				{
					type: 'specialization',
					title: specialization,
					univeristy: specializationUniversity,
					year: specializationYear
				},
				{
					type: 'subSpecialization',
					title: subspecialization,
					univeristy: subspecializationUniversity,
					year: subspecializationYear
				}
			],
			social: [
				{ name: 'instagram', value: instagram },
				{ name: 'facebook', value: facebook },
				{ name: 'twitter', value: twitter }
			]
		};
	}

	async create(data, opts) {
		let transaction;
		try {
			transaction = opts.transaction || (await Connection.transaction());

			let doctor = await super.create(data, { transaction });

			await contactService.create(
				{
					...data.contact,
					user_id: doctor.id
				},
				{ transaction }
			);

			if (!opts.transaction) transaction.commit();

			return await this.get(doctorId);
		} catch (error) {
			if (transaction && !opts.transaction) {
				transaction.rollback(error);
			}

			throw error;
		}
	}

	async update(doctorId, data, opts) {
		let transaction;
		try {
			transaction = opts.transaction || (await Connection.transaction());

			const doctor = await super.update(doctorId, data, { transaction });

			if (data.contact)
				await contactService.update(
					doctor.contact.id,
					{
						...data.contact,
						user_id: doctor.id
					},
					{ transaction }
				);

			if (data.additionalFields) {
				await this.updateOrCreateAdditionalFields(doctor.contact.id, data.additionalFields, {
					transaction
				});
			}

			if (!opts.transaction) transaction.commit();

			return await this.get(doctorId);
		} catch (error) {
			if (transaction && !opts.transaction) {
				transaction.rollback(error);
			}

			throw error;
		}
	}

	async getAll(filters = {}, pagination = { page: 0, pageSize: 100 }) {
		const result = await super.getAll(
			{
				[Sequelize.Op.and]: [Sequelize.where(Sequelize.col('contact.is_doctor'), true)],
				...filters
			},
			pagination
		);
		result.records = result.records.map(r => r.toJSON());
		return result;
	}

	async getAdditionalFieldsByContactId(contactId, opts) {
		const queryUpperMod = {
			...opts,
			attributes: ['id'],
			where: sequelize.where(sequelize.col('upport_table_name'), this.upportModule),
			include: [
				{
					attributes: ['id', 'additional_field_key_name'],
					model: Models.AdditionalFieldKey,
					as: 'additionalFieldKeys',
					required: true,
					include: {
						attributes: ['id', 'additional_field_values'],
						model: Models.AdditionalFieldValue,
						as: 'additionalFieldValues',
						required: false,
						where: sequelize.where(
							sequelize.col('additionalFieldKeys.additionalFieldValues.contact_id'),
							contactId
						)
					}
				}
			]
		};

		const result = await Models.UpportModule.findAll(queryUpperMod);
		let additionalFields = [];

		for (let uppModule of result) {
			for (let addField of uppModule.additionalFieldKeys) {
				let additionalField = {
					additional_field_key_id: addField.id,
					additional_field_key_name: addField.additional_field_key_name,
					additional_field_values: undefined
				};

				if (addField.additionalFieldValues.length > 0) {
					additionalField.additional_field_values =
						addField.additionalFieldValues[0].additional_field_values;
				}

				additionalFields.push(additionalField);
			}
		}

		return additionalFields;
	}

	async updateOrCreateAdditionalFields(contactId, additionalFields, opts) {
		for (let additionalField of additionalFields) {
			const [addFieldValue, isNew] = await Models.AdditionalFieldValue.findOrCreate({
				where: {
					contact_id: contactId,
					additional_field_key_id: additionalField.additional_field_key_id
				},
				default: {
					contact_id: contactId,
					additional_field_key_id: additionalField.additional_field_key_id,
					additional_field_values: additionalField.additional_field_values
				},
				transaction: opts.transaction
			});

			addFieldValue.additional_field_values = additionalField.additional_field_values;
			await addFieldValue.save({ transaction: opts.transaction });
		}
	}
}

const doctorService = new DoctorService();

export { DoctorService };
export { doctorService };
export default DoctorService;
