import Sequelize from 'sequelize';
import { ApolloError } from 'apollo-server-errors';
import Models, { sequelize as Connection, sequelize } from '../../../database/mySql';
import { UserService } from '../../user/services/userService.js';

export class DoctorService extends UserService {
	constructor() {
		super('Doctor', 'doctors');
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

	adapter(doctor) {
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
			contact: doctor.contact,
			education: [
				{
					type: 'specialization',
					title: specialization,
					university: specializationUniversity,
					year: specializationYear
				},
				{
					type: 'subSpecialization',
					title: subspecialization,
					university: subspecializationUniversity,
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

	async get(doctorId, opts) {
		const doctor = await super.get(doctorId, {
			...opts,
			adapter: this.adapter.bind(this)
		});

		if (!doctor || !doctor?.contact?.is_doctor)
			throw new ApolloError(`${this.modelLabel} not found`, `${this.modelLabel}FindError`);

		return doctor;
	}

	async getAll(filters = {}, pagination = { page: 0, pageSize: 100 }) {
		const result = await super.getAll(
			{
				[Sequelize.Op.and]: [Sequelize.where(Sequelize.col('contact.is_doctor'), true)],
				...filters
			},
			pagination
		);

		return result;
	}
}

export const doctorService = new DoctorService();

export default DoctorService;
