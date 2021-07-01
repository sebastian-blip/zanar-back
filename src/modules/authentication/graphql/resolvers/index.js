import * as authenticationService from '../../services/authenticationService';

const authenticationMutations = {
	login: (root, { username, password }) => authenticationService.login(username, password),
	refreshToken: (root, values, context) => {
		authenticationService.isAuthenticate(context);
		return authenticationService.refreshTokenSession(context.refresh);
	}
};

// eslint-disable-next-line import/prefer-default-export
export { authenticationMutations };
