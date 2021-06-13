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
			include: [
				{
					attributes: [],
					model: Models.Contact,
					as: 'contact',
					where: {
						is_doctor: true
					}
				}
			],
			raw: true
		});
	}
}

const userDao = new UserDao();

export { userDao };
