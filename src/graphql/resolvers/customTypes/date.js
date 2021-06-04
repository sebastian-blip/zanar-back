import moment from 'moment';
import { GraphQLScalarType, Kind, GraphQLError } from 'graphql';

const validDateFormat = date => {
	if (typeof date !== 'string') {
		throw new TypeError(`Value is not string: ${date}`);
	}
	const dateRegex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
	if (!dateRegex.test(date)) throw new TypeError(`The value is not a valid date: ${date}`);
};

const dateScalar = new GraphQLScalarType({
	name: 'Date',
	description: 'Date custom scalar type',
	serialize(value) {
		return moment(value).format('YYYY-MM-DD');
	},
	parseValue(value) {
		validDateFormat(value);
		return moment(value).toDate();
	},
	parseLiteral(ast) {
		validDateFormat(ast.value);
		if (ast.kind !== Kind.STRING) {
			throw new GraphQLError(`Can only validate strings as local times but got a: ${ast.kind}`);
		}
		return moment(ast.value).toDate();
	}
});

export default dateScalar;
