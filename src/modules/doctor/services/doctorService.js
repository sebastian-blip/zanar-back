import Sequelize from 'sequelize';
import moment from 'moment';
import { ApolloError } from 'apollo-server-errors';
import Models, { sequelize as Connection, sequelize } from '../../../database/mySql';
import { UserService } from '../../user/services/userService.js';
import { FileManager } from '../../../utils/fileUploader';
import { S3Manager } from '../../../utils/s3Manager';

export class DoctorService extends UserService {
	constructor() {
		super('Doctor', 'doctors');
		this.doctorAdditionalFields = {
			sex: 'text_doctor_gender',
			birthday: 'date_doctor_birthday',
			instagram: 'text_doctor_instagram',
			facebook: 'text_doctor_facebook',
			twitter: 'text_doctor_twitter',
			specialization: 'text_doctor_specialty',
			specializationUniversity: 'text_doctor_university',
			specializationYear: 'text_doctor_year_degree',
			subspecialization: 'text_doctor_subspecialty',
			subspecializationUniversity: 'text_doctor_university_subspecialty',
			subspecializationYear: 'text_doctor_year_degree_subspecialty',
			rm: 'text_doctor_rm'
		};
		this.avatarFolder = 'avatar_files';
		this.FileManager = new FileManager(this.avatarFolder);
		this.S3Manager = new S3Manager();
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
			},
			{
				model: Models.TypeDocument,
				as: 'documentType',
				required: false
			}
		];
	}

	/* adapter(doctor) {
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
		const rm = this.getAdditionalFieldByKeyName(additionalFields, 'text_Doctor_RM');

		return {
			name: doctor.name,
			lastNames: doctor.family,
			rm,
			sex,
			phone: doctor.phone,
			birthday,
			city: doctor.city,
			email: doctor.email,
			national_id: doctor.national_id,
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
	} */

	async inputAdapter(data) {
		if (!data.additionalFields) data.additionalFields = [];

		const allAdditionalFieldKeys = await this.getAdditionalFieldsOfModule();
		const docAdditionalFields = {};
		const buildNewAdditionalField = (key, value) => {
			return {
				additional_field_key_id: key.id,
				additional_field_values: value
			};
		};

		for (let key in this.doctorAdditionalFields) {
			docAdditionalFields[this.doctorAdditionalFields[key]] = key;
		}

		allAdditionalFieldKeys.forEach(key => {
			const keyName = key.additional_field_key_name.trim().toLowerCase();
			const inputKey = docAdditionalFields[keyName];

			if (inputKey && data[inputKey]) {
				if (inputKey == 'birthday') {
					data.additionalFields.push(
						buildNewAdditionalField(key, moment(data[inputKey]).format('YYYY-MM-DD'))
					);
				} else {
					data.additionalFields.push(buildNewAdditionalField(key, data[inputKey]));
				}
			}
		});

		if (data.lastNames) data.family = data.lastNames;

		return data;
	}

	outputAdapter(doctor) {
		let newFormat = doctor;

		let addAdditionalFields = (obj, keyValues) => {
			for (let key in keyValues) {
				if (typeof keyValues[key] == 'string') {
					obj[key] = this.getAdditionalFieldByKeyName(
						doctor.additionalFields || [],
						keyValues[key]
					);
				} else if (typeof keyValues[key] == 'object') {
					obj[key] = {};
					addAdditionalFields(obj[key], keyValues[key]);
				}
			}
		};

		addAdditionalFields(newFormat, this.doctorAdditionalFields);

		newFormat.lastNames = newFormat.family;
		newFormat.education = [
			{
				type: 'specialization',
				title: newFormat.specialization,
				university: newFormat.specializationUniversity,
				year: newFormat.specializationYear
			},
			{
				type: 'subSpecialization',
				title: newFormat.subspecialization,
				university: newFormat.subspecializationUniversity,
				year: newFormat.subspecializationYear
			}
		];
		newFormat.social = [
			{ name: 'instagram', value: newFormat.instagram },
			{ name: 'facebook', value: newFormat.facebook },
			{ name: 'twitter', value: newFormat.twitter }
		];

		return newFormat;
	}

	async get(doctorId, opts) {
		const doctor = await super.get(doctorId, {
			...opts,
			adapter: this.outputAdapter.bind(this)
		});

		if (!doctor || !doctor?.contact?.is_doctor)
			throw new ApolloError(`${this.modelLabel} not found`, `${this.modelLabel}FindError`);

		return doctor;
	}

	async update(doctorId, data, opts) {
		let transaction;
		let avatarFile = await data.avatar_file;
		if (data.avatar_file)
			avatarFile = await this.FileManager.put({
				filename: avatarFile.filename,
				stream: avatarFile.createReadStream()
			});

		let doctor;
		try {
			transaction = opts.transaction || (await Connection.transaction());

			let doctorData = await this.inputAdapter(data);
			doctor = await this.get(doctorId, { transaction });

			if (data.avatar_file) {
				const { path, fileName } = avatarFile;
				const s3FilePath = `${this.avatarFolder}/${fileName}`;

				await this.S3Manager.move(path, s3FilePath);

				doctorData.avatar = s3FilePath;

				if (doctor.avatar) {
					await this.S3Manager.delete(doctor.avatar);
				}
			}

			doctor = await super.update(doctorId, doctorData, {
				...opts,
				transaction
			});

			if (!opts.transaction) transaction.commit();
		} catch (error) {
			if (transaction && !opts.transaction) {
				transaction.rollback(error);
			}
			throw error;
		} finally {
			if (data.avatar_file) await this.FileManager.delete(avatarFile.fileName);
		}

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
