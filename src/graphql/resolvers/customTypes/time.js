import { GraphQLScalarType, Kind, GraphQLError } from 'graphql';

// 24-hour time with optional seconds and milliseconds - `HH:mm[:ss[.SSS]]`
const LOCAL_TIME_FORMAT = /^([0-1][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9](\.\d{3})?)?$/;

export function validateLocalTime(value) {
	if (typeof value !== 'string') {
		throw new TypeError(`Value is not string: ${value}`);
	}

	const isValidFormat = LOCAL_TIME_FORMAT.test(value);
	if (!isValidFormat) {
		throw new TypeError(`Value is not a valid LocalTime: ${value}`);
	}

	return value;
}

const timeScalar = new GraphQLScalarType({
	name: 'Time',
	description: 'Time custom scalar type',
	serialize(value) {
		return validateLocalTime(value);
	},
	parseValue(value) {
		return validateLocalTime(value);
	},
	parseLiteral(ast) {
		if (ast.kind !== Kind.STRING) {
			throw new GraphQLError(`Can only validate strings as local times but got a: ${ast.kind}`);
		}

		return validateLocalTime(ast.value);
	}
});

export default timeScalar;
