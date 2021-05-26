import { GraphQLScalarType } from 'graphql';

const validDateFormat = date => {
	const dateRegex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
	return dateRegex.test(date);
};

const dateScalar = new GraphQLScalarType({
	name: 'Date',
	description: 'Date custom scalar type',
	serialize(value) {
		return value;
	},
	parseValue(value) {
		return validDateFormat(value) ? new Date(value) : null;
	},
	parseLiteral(ast) {
		return validDateFormat(ast.value) ? new Date(ast.value) : null;
	}
});

const validHourFormat = date => {
	const dateRegex = /(2[0-3]|[01][0-9]):[0-5][0-9]-(2[0-3]|[01][0-9]):[0-5][0-9]/;
	return dateRegex.test(date);
};

const hourScalar = new GraphQLScalarType({
	name: 'Hour',
	description: 'Hour custom scalar type',
	serialize(value) {
		return value;
	},
	parseValue(value) {
		return validHourFormat(value) ? value : null;
	},
	parseLiteral(ast) {
		return validHourFormat(ast.value) ? ast.value : null;
	}
});

export { dateScalar, hourScalar };
