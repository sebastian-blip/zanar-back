import {} from 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import { sequelize } from './database/mySql';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { getUser } from './modules/authentication/services';

mongoose.Promise = global.Promise;

const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://zanar-prescriptor-ui.herokuapp.com/', 'http://localhost:4500'];

const corsOptions = {
	origin(origin, callback) {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	}
};

app.use(cors(corsOptions));

app.use(helmet());

app.use(bodyParser.json({ limit: '8mb' }));

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => {
		return {
			...req,
			user: req?.headers?.authorization ? getUser(req) : null
		};
	}
});

server.applyMiddleware({ app });

sequelize
	.sync()
	.then(() => {
		try {
			const port = process.env.PORT || 4500;
			app.listen({ port }, () => {
				console.log(`Server is working on localhost:4500${server.graphqlPath}`);
			});
		} catch (errServer) {
			console.log('se ha presentado un error al encender la Aplicación.');
			console.log(`El error es ${errServer}`);
			throw errServer;
		}
	})
	.catch(err => {
		if (err) {
			console.log(`Mysql error: ${err}`);
			throw err;
		}
	});
