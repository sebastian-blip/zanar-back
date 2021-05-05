import { dateScalar } from './customTypes';
import { consultingRoomMutations, consultingRoomQueries } from './consultingRoom';
import { officeScheduleMutations, officeScheduleQueries } from './officeSchedule';

const resolvers = {
	Query: {
		...consultingRoomQueries,
		...officeScheduleQueries
	},
	Mutation: {
		...consultingRoomMutations,
		...officeScheduleMutations
	},
	Date: dateScalar
};

export default resolvers;
