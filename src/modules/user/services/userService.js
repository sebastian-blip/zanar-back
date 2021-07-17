import Sequelize from 'sequelize';
import { ApolloError } from 'apollo-server-errors';
import resourceDao from '../../../database/mySql/resourceDao/resourceDao';
import Models, { sequelize as Connection, sequelize } from '../../../database/mySql';
import { contactService } from '../../contact/services/contactService';
import { roleService } from './roleService';
import { FileManager } from '../../../utils/fileUploader';
import { S3Manager } from '../../../utils/s3Manager';
import _ from 'lodash';

class UserService extends resourceDao {
	constructor(modelLabel = 'User', upportModule = 'contacts') {
		super(Models.User, modelLabel);
		this.upportModule = upportModule;
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
			}
		];
	}

	async get(userId, opts) {
		let user = await super.get(userId, opts);

		if (!user) throw new ApolloError(`${this.modelLabel} not found`, `${this.modelLabel}FindError`);

		if (opts?.includeAdditionalFields) {
			user.additionalFields = await this.getAdditionalFieldsByContactId(user.contact.id);
		}

		if (opts?.adapter) {
			user = opts.adapter(user);
		}

		return user;
	}

	async create(data, opts) {
		let transaction;
		let user = undefined;
		try {
			transaction = opts.transaction || (await Connection.transaction());

			user = await super.create(
				{
					...data,
					status: 1
				},
				{ transaction }
			);

			//Create the contact
			const userContact = await contactService.create(
				{
					...data.contact,
					user_id: user.id
				},
				{ transaction }
			);

			//Associate the role
			if (data.roleName) {
				let role = await roleService.getByName(data.roleName, { transaction });

				if (!role)
					throw new ApolloError(
						`${roleService.modelLabel} not found`,
						`${this.modelLabel}FindError`
					);

				await user.addRole(role, { transaction });
			}

			//Create the additional fields
			if (data.additionalFields) {
				await this.updateOrCreateAdditionalFields(userContact.id, data.additionalFields, {
					...opts,
					transaction
				});
			}

			if (data.avatar_file) {
				await this.updateAvatar(user.id, data.avatar_file, { transaction });
			}

			user = await this.get(user.id, { transaction });

			if (!opts.transaction) transaction.commit();

			return user;
		} catch (error) {
			if (transaction && !opts.transaction) {
				transaction.rollback(error);
			}

			throw error;
		}
	}

	async update(userId, data, opts) {
		let transaction;
		try {
			transaction = opts.transaction || (await Connection.transaction());

			const user = await super.update(userId, data, { transaction });

			if (data.contact)
				await contactService.update(
					user.contact.id,
					{
						...data.contact,
						user_id: user.id
					},
					{ transaction }
				);

			if (data.additionalFields) {
				await this.updateOrCreateAdditionalFields(user.contact.id, data.additionalFields, {
					transaction
				});
			}

			if (data.avatar_file) {
				await this.updateAvatar(userId, data.avatar_file, { transaction });
			}

			if (!opts.transaction) transaction.commit();

			return await this.get(userId, opts);
		} catch (error) {
			if (transaction && !opts.transaction) {
				transaction.rollback(error);
			}

			throw error;
		}
	}

	async getAll(filters = {}, pagination = { page: 0, pageSize: 100 }) {
		const result = await super.getAll(filters, pagination);

		result.records = result.records.map(r => r.toJSON());

		return result;
	}

	async getAdditionalFieldsOfModule() {
		const queryUpperMod = {
			attributes: ['id'],
			where: sequelize.where(sequelize.col('upport_table_name'), this.upportModule),
			include: [
				{
					attributes: ['id', 'additional_field_key_name'],
					model: Models.AdditionalFieldKey,
					as: 'additionalFieldKeys',
					required: true
				}
			]
		};

		const result = await Models.UpportModule.findAll(queryUpperMod);

		let additionalFields = _.union.apply(
			this,
			result.map(upportModule => upportModule.additionalFieldKeys)
		);

		return additionalFields;
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

	getAdditionalFieldByKeyName(additionalFields, name) {
		const additionalField = additionalFields.find(
			additionalField =>
				additionalField.additional_field_key_name.trim().toLowerCase() === name.trim().toLowerCase()
		);
		return additionalField?.additional_field_values || '';
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

	async updateAvatar(userId, avatarFileData, opts = {}) {
		const isPromise = p => {
			return p && Object.prototype.toString.call(p) === '[object Promise]';
		};

		let transaction;
		let avatarFile = undefined;

		try {
			transaction = opts.transaction || (await Connection.transaction());

			const user = this.get(userId, { transaction });
			avatarFile = await (isPromise(avatarFileData) ? avatarFileData : avatarFileData.promise);

			console.log('Try update avatar -> upload file');
			avatarFile = await this.FileManager.put({
				filename: avatarFile.filename,
				stream: avatarFile.createReadStream()
			});

			const { path, fileName } = avatarFile;
			const s3FilePath = `${this.avatarFolder}/${fileName}`;

			console.log('Try update avatar -> move file to S3');
			await this.S3Manager.move(path, s3FilePath);

			if (user.avatar) {
				console.log('Try update avatar-> delete oldFile in S3');
				await this.S3Manager.delete(user.avatar);
			}

			await this.update(
				userId,
				{
					avatar: s3FilePath
				},
				{ transaction }
			);

			if (!opts.transaction) transaction.commit();
		} catch (error) {
			console.log('Try update avatar -> error', error);
		} finally {
			if (avatarFile && avatarFile.fileName) {
				console.log('Try update avatar -> delete temp file');
				await this.FileManager.delete(avatarFile.fileName);
			}
		}
	}
}

const userService = new UserService();

export { UserService };
export { userService };
export default UserService;
