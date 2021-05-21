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
import { diseasesQueries } from '../../modules/diseases/graphql/resolvers';
import { epsQueries } from '../../modules/eps/graphql/resolvers';
import {
	medicalFormulaMutations,
	medicalFormulaQueries
} from '../../modules/medicalFormula/graphql/resolvers';
import DoctorResolvers from '../../modules/doctor/graphql/resolvers';

const resolvers = {
	Query: {
		...consultingRoomQueries,
		...officeScheduleQueries,
		...mileQueries,
		...diseasesQueries,
		...epsQueries,
		...medicalFormulaQueries
	},
	Mutation: {
		...consultingRoomMutations,
		...officeScheduleMutations,
		...authenticationMutations,
		...medicalFormulaMutations
	},
	Date: dateScalar
};

export default _.merge(resolvers, DoctorResolvers);
