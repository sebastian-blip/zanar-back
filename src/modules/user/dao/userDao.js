import Models from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';

export default class UserDao extends ResourceDao {
	constructor() {
		super(Models.User, 'User');
	}

	login(username, password) {
		return this.model.findOne({
			attributes: ['id', 'user_type'],
			where: { national_id: username },
			raw: true
		});
	}
}

const userDao = new UserDao();

export { userDao };
