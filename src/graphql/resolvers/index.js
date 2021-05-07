import { dateScalar } from './customTypes';
import { consultingRoomMutations, consultingRoomQueries } from './consultingRoom';
import { officeScheduleMutations, officeScheduleQueries } from './officeSchedule';
import { mileQueries } from './mile';

const resolvers = {
	Query: {
		...consultingRoomQueries,
		...officeScheduleQueries,
		...mileQueries
	},
	Mutation: {
		...consultingRoomMutations,
		...officeScheduleMutations
	},
	Date: dateScalar
};

export default resolvers;
