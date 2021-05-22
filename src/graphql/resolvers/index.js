import * as _ from 'lodash';
import { dateScalar } from './customTypes';
import {
	consultingRoomMutations,
	consultingRoomQueries
} from '../../modules/consultingRoom/graphql/resolvers';
import {
	officeScheduleMutations,
	officeScheduleQueries
} from '../../modules/officeSchedule/graphql/resolvers';
import { authenticationMutations } from '../../modules/authentication/graphql/resolvers';
import { mileQueries } from '../../modules/mile/graphql/resolvers';
import DoctorResolvers from '../../modules/doctor/graphql/resolvers';
import ERPResolvers from '../../modules/erp/graphql/resolvers';

const resolvers = {
	Query: {
		...consultingRoomQueries,
		...officeScheduleQueries,
		...mileQueries,
	},
	Mutation: {
		...consultingRoomMutations,
		...officeScheduleMutations,
		...authenticationMutations
	},
	Date: dateScalar
};

export default _.merge(
	resolvers,
	DoctorResolvers,
	ERPResolvers
);
