import { GraphQLScalarType, Kind, GraphQLError } from 'graphql';

// 24-hour time with optional seconds and milliseconds - `HH:mm[:ss[.SSS]]`
const HOUR_FORMAT = /(2[0-3]|[01][0-9]):[0-5][0-9]-(2[0-3]|[01][0-9]):[0-5][0-9]/;

export function validateHour(value) {
	if (typeof value !== 'string') throw new TypeError(`Value is not string: ${value}`);
	if (!HOUR_FORMAT.test(value)) throw new TypeError(`Value is not a valid LocalTime: ${value}`);
	return value;
}

const hourScalar = new GraphQLScalarType({
	name: 'Hour',
	description: 'Hour custom scalar type',
	serialize(value) {
		return validateHour(value);
	},
	parseValue(value) {
		return validateHour(value);
	},
	parseLiteral(ast) {
		if (ast.kind !== Kind.STRING)
			throw new GraphQLError(`Can only validate strings as local times but got a: ${ast.kind}`);
		return validateHour(ast.value);
	}
});

export default hourScalar;
