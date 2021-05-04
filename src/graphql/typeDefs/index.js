import { importSchema } from 'graphql-import';

const typeDefs = importSchema('src/graphql/typeDefs/schema.graphql');

export default typeDefs;
