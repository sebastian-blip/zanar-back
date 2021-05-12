import { dateScalar } from './customTypes';
import { consultingRoomMutations, consultingRoomQueries } from './consultingRoom';
import { officeScheduleMutations, officeScheduleQueries } from './officeSchedule';
import { authenticationMutations } from './authentication';
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
		...DoctorResolvers.Mutations,
		...authenticationMutations
	},
	Date: dateScalar
};

export default resolvers;
