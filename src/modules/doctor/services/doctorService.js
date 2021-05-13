import { ApolloError } from 'apollo-server-errors';
import ResourceService from '../../../services/resourceService';
import Sequelize from 'sequelize';
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
        ]
    }

    async get(doctorId, opts) {
        const doctor = (await super.get(doctorId))?.toJSON();
        if (!doctor || !doctor?.contact?.is_doctor) throw new ApolloError(`${this.modelLabel} not found`, `${this.modelLabel}FindError`);
        if (opts?.includeAdditionalFields) {
            doctor.additionalFields = await this.getAdditionalFields(doctorId);
        }
        return doctor;
    }

    async create(data, opts) {
        let transaction;
        try {
            transaction = opts.transaction || await Connection.transaction();

            let doctor = await super.create(data, { transaction });

            await contactService.create(
                {
                    ...data.contact,
                    user_id: doctor.id
                },
                { transaction }
            )

            if (!opts.transaction) transaction.commit();

            return await this.get(doctorId);
        }
        catch (error) {
            if (transaction && !opts.transaction) {
                transaction.rollback(error);
            }

            throw error;
        }
    }

    async update(doctorId, data, opts) {
        let transaction;
        try {
            transaction = opts.transaction || await Connection.transaction();

            const doctor = await super.update(doctorId, data, { transaction });

            if (data.contact) await contactService.update(
                doctor.contact.id,
                {
                    ...data.contact,
                    user_id: doctor.id,
                },
                { transaction }
            );

            if (!opts.transaction) transaction.commit();

            return await this.get(doctorId);
        }
        catch (error) {
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

    async getAdditionalFields(doctorId, opts) {
        let doctor = await this.get(doctorId);
        if (doctor) {
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
                            where: sequelize.where(sequelize.col('additionalFieldKeys.additionalFieldValues.contact_id'), doctor.contact.id)
                        }
                    }
                ]
            }

            const result = (await Models.UpportModule.findAll(queryUpperMod));
            let additionalFields = [];

            for (let uppModule of result) {
                for (let addField of uppModule.additionalFieldKeys) {
                    let additionalField = {
                        additional_field_key_id: addField.id,
                        additional_field_key_name: addField.additional_field_key_name,
                        additional_field_values: undefined
                    };

                    if (addField.additionalFieldValues.length > 0) {
                        additionalField.additional_field_values = addField.additionalFieldValues[0].additional_field_values
                    }

                    additionalFields.push(additionalField);
                }
            }

            return additionalFields;
        }
    }

}

const doctorService = new DoctorService;

export { DoctorService }
export { doctorService };
export default DoctorService;
