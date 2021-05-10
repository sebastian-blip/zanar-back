import { dateScalar } from './customTypes';
import { consultingRoomMutations, consultingRoomQueries } from './consultingRoom';
import { officeScheduleMutations, officeScheduleQueries } from './officeSchedule';
import { mileQueries } from './mile';
import DoctorResolvers from './doctor';

const resolvers = {
	Query: {
		...consultingRoomQueries,
		...officeScheduleQueries,
		...mileQueries,
		...DoctorResolvers.Queries
	},
	Mutation: {
		...consultingRoomMutations,
		...officeScheduleMutations,
		...DoctorResolvers.Mutations
	},
	Date: dateScalar
};

export default resolvers;
