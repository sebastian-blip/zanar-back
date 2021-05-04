import { UserQueries, UserMutations } from './user';

const resolvers = {
	Query: {
		// Users queries
		...UserQueries
	},
	Mutation: {
		// Users mutations
		...UserMutations
	}
};

export default resolvers;
