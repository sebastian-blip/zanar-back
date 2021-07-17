import Models from '../../../database/mySql';
import ResourceDao from '../../../database/mySql/resourceDao/resourceDao';
import { Encryption } from '../../../utils/encryption';

export default class UserDao extends ResourceDao {
	constructor() {
		super(Models.User, 'User');
	}

	async login(username, password) {
		const user = await this.model.findOne({
			attributes: ['id', 'user_type', 'password'],
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
		if (user && user.password && Encryption.compare(password, user.password)) {
			return user;
		}
		else{
			return undefined;
		}
	}
}

const userDao = new UserDao();

export { userDao };
