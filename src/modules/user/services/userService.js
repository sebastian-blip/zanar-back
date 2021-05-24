import Sequelize from 'sequelize';
import { ApolloError } from 'apollo-server-errors';
import ResourceService from '../../../database/mySql/resourceService/resourceService';
import Models, { sequelize as Connection, sequelize } from '../../../database/mySql';
import { contactService } from '../../contact/services/contactService';
import { roleService } from './roleService';
import _ from 'lodash';

class UserService extends ResourceService {
	constructor(modelLabel = 'User', upportModule = 'contacts') {
		super(Models.User, modelLabel);
		this.upportModule = upportModule;
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
			let role = await roleService.getByName(data.roleName, { transaction });

			if (!role)
				throw new ApolloError(`${roleService.modelLabel} not found`, `${this.modelLabel}FindError`);

			user = await super.create(
				{
					...data,
					status: 1
				},
				{ transaction }
			);

			await contactService.create(
				{
					...data.contact,
					user_id: user.id
				},
				{ transaction }
			);

			await user.addRole(role, { transaction });

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

			if (!opts.transaction) transaction.commit();

			return await this.get(userId);
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
			...opts,
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
			additionalField => additionalField.additional_field_key_name === name
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
}

const userService = new UserService();

export { UserService };
export { userService };
export default UserService;
