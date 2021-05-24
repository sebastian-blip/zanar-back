import Sequelize from 'sequelize';
import { ApolloError } from 'apollo-server-errors';
import ResourceService from '../../../database/mySql/resourceService/resourceService';
import Models, { sequelize as Connection, sequelize } from '../../../database/mySql';
import _ from 'lodash';

export class RoleService extends ResourceService {
	constructor() {
		super(Models.Role, 'Role');
	}

	async getByName(name, optQuery = {}) {
		const query = {
            where: {
                name
            },
			include: await this.getIncludeQuery(),
			paranoid: false,
			...optQuery
		};
		const record = this.Model.findOne(query);
		return record;
	}
}

export const roleService = new RoleService();

export default RoleService;
