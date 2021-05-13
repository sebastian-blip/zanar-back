import { dateScalar } from './customTypes';
import { consultingRoomMutations, consultingRoomQueries } from '../../modules/consultingRoom/graphql/resolvers';
import { officeScheduleMutations, officeScheduleQueries } from '../../modules/officeSchedule/graphql/resolvers';
import { authenticationMutations } from '../../modules/authentication/graphql/resolvers';
import { mileQueries } from '../../modules/mile/graphql/resolvers';
import DoctorResolvers from '../../modules/doctor/graphql/resolvers';

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
