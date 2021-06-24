import * as _ from 'lodash';
import { dateScalar, timeScalar, hourScalar } from './customTypes';
import {
	consultingRoomMutations,
	consultingRoomQueries
} from '../../modules/consultingRoom/graphql/resolvers';
import {
	officeScheduleMutations,
	officeScheduleQueries
} from '../../modules/officeSchedule/graphql/resolvers';
import { authenticationMutations } from '../../modules/authentication/graphql/resolvers';
import { diseasesQueries } from '../../modules/diseases/graphql/resolvers';
import { epsQueries } from '../../modules/eps/graphql/resolvers';
import { typeDocumentQueries } from '../../modules/typeDocument/graphql/resolvers';
import {
	medicalFormulaMutations,
	medicalFormulaQueries
} from '../../modules/medicalFormula/graphql/resolvers';
import MedicalAppoitment from '../../modules/medicalAppoitment/graphql/resolvers';
import PatientResolvers from '../../modules/patient/graphql/resolvers';
import DoctorResolvers from '../../modules/doctor/graphql/resolvers';
import ERPResolvers from '../../modules/erp/graphql/resolvers';
import MileResolvers from '../../modules/mile/graphql/resolvers';

const resolvers = {
	Query: {
		...consultingRoomQueries,
		...officeScheduleQueries,
		...diseasesQueries,
		...epsQueries,
		...medicalFormulaQueries,
		...typeDocumentQueries
	},
	Mutation: {
		...consultingRoomMutations,
		...officeScheduleMutations,
		...authenticationMutations,
		...medicalFormulaMutations
	},
	Date: dateScalar,
	Time: timeScalar,
	Hour: hourScalar
};

export default _.merge(
	resolvers,
	DoctorResolvers,
	ERPResolvers,
	PatientResolvers,
	MedicalAppoitment,
	MileResolvers
);
