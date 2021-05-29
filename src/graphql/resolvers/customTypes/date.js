import { GraphQLScalarType, Kind } from 'graphql';
import moment from 'moment';

const dateScalar = new GraphQLScalarType({
	name: 'Date',
	description: 'Date custom scalar type',
	serialize(value) {
		return value; // Convert outgoing Date to integer for JSON
	},
	parseValue(value) {
		return new Date(value); // Convert incoming integer to Date
	},
	parseLiteral(ast) {
		try {
			let date;
			if (ast.kind === Kind.INT) {
				date = new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
			} else {
				date = moment(ast.value).toDate();
			}
			// eslint-disable-next-line no-restricted-globals
			if (isNaN(date)) throw new Error();
			return date;
		} catch (error) {
			return null;
		}
	}
});

export default dateScalar;
