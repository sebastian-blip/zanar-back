import { traceError, traceBegin, traceEnd, traceFilter } from '../../../utils/logger';
import { manageError } from '../../../utils/errorManager';
import UserModel from '../../../database/mongoDB/models/user';

const UserQueries = {
	getUsers: () => {
		return new Promise(async (resolve, rejects) => {
			traceBegin('getUsers');
			try {
				traceEnd('getUsers');
				resolve(UserModel.find());
			} catch (error) {
				traceError('getUsers', error);
				rejects(manageError(error));
			}
		});
	}
};

const UserMutations = {
	createUser: (root, { input }) => {
		return new Promise(async (resolve, rejects) => {
			traceBegin('createUser');
			traceFilter('createUser', input);
			try {
				const obUser = new UserModel(input);
				await obUser.save();
				traceEnd('createUser');
				resolve(obUser);
			} catch (error) {
				traceError('createUser', error);
				rejects(manageError(error));
			}
		});
	}
};

export { UserQueries, UserMutations };
