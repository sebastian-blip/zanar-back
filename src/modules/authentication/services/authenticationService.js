import { ApolloError } from 'apollo-server-errors';
import { userDao } from '../../user/dao/userDao';
import { generateToken, verifyToken } from '../../../utils/security/token';

const NOT_AUTHENTICATED_MESSAGE = 'Not authenticated';
const SECURITY_ERROR = 'SECURITY_ERROR';

const getAndValidateUser = (req, authToken) => {
	let token = authToken;
	if (req) {
		const authHeader = req.headers.authorization;
		if (authHeader) {
			token = authHeader.replace('Bearer ', '');
			if (!token) {
				throw new ApolloError('No token found', SECURITY_ERROR);
			}
		}
	}
	const user = verifyToken(token);
	if (!user) throw new ApolloError(NOT_AUTHENTICATED_MESSAGE, SECURITY_ERROR);

	return user;
};

const isAuthenticate = context => {
	if (!context?.user) throw new ApolloError(NOT_AUTHENTICATED_MESSAGE, SECURITY_ERROR);
};

const login = async (username, password) => {
	const user = await userDao.login(username, password);
	if (!user) throw new ApolloError('The username or password is incorrect', SECURITY_ERROR);
	const token = generateToken(user);
	const refreshToken = generateToken(user, true);
	return {
		token,
		user,
		refreshToken
	};
};

const refreshTokenSession = authToken => {
	// eslint-disable-next-line camelcase
	const { id, user_type } = verifyToken(authToken, true);
	const userData = { id, user_type };
	const token = generateToken(userData);
	const refreshToken = generateToken(userData, true);
	return {
		user: userData,
		token,
		refreshToken
	};
};

export {
	getAndValidateUser,
	login,
	isAuthenticate,
	refreshTokenSession,
	NOT_AUTHENTICATED_MESSAGE
};
