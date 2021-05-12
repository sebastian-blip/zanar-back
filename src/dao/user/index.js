import Models from '../../database/mySql';

const login = (username, password) => {
	return Models.User.findOne({
		attributes: ['id', 'user_type'],
		where: { username, password },
		raw: true
	});
};

// eslint-disable-next-line import/prefer-default-export
export { login };
