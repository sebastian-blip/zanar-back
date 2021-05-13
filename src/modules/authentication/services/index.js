import * as userDao from '../../../dao/user';
import { generateToken, verifyToken } from '../../../utils/security/token';

const getUser = (req, authToken) => {
	let token = authToken;
	if (req) {
		const authHeader = req.headers.authorization;
		if (authHeader) {
			token = authHeader.replace('Bearer ', '');
			if (!token) {
				throw new Error('No token found');
			}
		}
	}
	const user = verifyToken(token);
	if (!user) throw new Error('Not authenticated');

	return user;
};

const isAuthenticate = (fn, context) => {
	if (!context?.user) throw new Error('Not authenticated');
	return (...args) => {
		return fn(...args);
	};
};

const login = async (username, password) => {
	const user = await userDao.login(username, password);
	if (!user) throw new Error('No user found');
	const token = generateToken(user);
	return {
		token,
		user
	};
};
export { getUser, login, isAuthenticate };
