import * as authentication from '../../services';

const authenticationMutations = {
	login: (root, { username, password }) => authentication.login(username, password)
};

// eslint-disable-next-line import/prefer-default-export
export { authenticationMutations };
