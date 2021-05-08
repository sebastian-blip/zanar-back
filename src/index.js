import {} from 'dotenv/config';
// import express from 'express';
import { ApolloServer } from 'apollo-server';
// import bodyParser from 'body-parser';
// import mongoose from 'mongoose';
// import helmet from 'helmet';
// import cors from 'cors';
import { sequelize } from './database/mySql';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

// mongoose.Promise = global.Promise;

// const app = express();

// const arrAllowedOrigins = [
// 	'http://localhost:7000',
// 	'http://localhost:3440',
// 	'http://localhost:4500',
// 	'http://localhost:4000'
// ];

// const corsOptions = {
// 	origin(origin, callback) {
// 		if (arrAllowedOrigins.indexOf(origin) !== -1 || !origin) {
// 			callback(null, true);
// 		} else {
// 			callback(new Error('Not allowed by CORS'));
// 		}
// 	}
// };

// app.use(cors(corsOptions));

// app.use(helmet());

// app.use(bodyParser.json({ limit: '8mb' }));

const server = new ApolloServer({
	typeDefs,
	resolvers
});

// server.applyMiddleware({ app });

sequelize
	.sync()
	.then(() => {
		try {
			const port = process.env.PORT || 4500;
			server.listen({ port }, () => {
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

// mongoose.connect(sbMongoDB, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
// 	if (err) {
// 		console.log('se ha presentado un error al conectarse al MongoDB.');
// 		console.log(`El error es ${err}`);
// 		throw err;
// 	} else {
// 		// if (populate === 'true') {
// 		//     seederMg();
// 		// }
// 		try {
// 			app.listen({ port: 4000 }, () => {
// 				console.log(`Server is working on localhost:4000${server.graphqlPath}`);
// 			});
// 		} catch (errServer) {
// 			console.log('se ha presentado un error al iniciar la Aplicación.');
// 			console.log(`El error es ${errServer}`);
// 			throw errServer;
// 		}
// 	}
// });

// sequelize
// 	.sync()
// 	.then(() => {
// 		mongoose.connect(sbMongoDB, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
// 			if (err) {
// 				console.log('se ha presentado un error al conectarse al MongoDB.');
// 				console.log(`El error es ${err}`);
// 				throw err;
// 			} else {
// 				try {
// 					app.listen({ port: 4500 }, () => {
// 						console.log(`Server is working on localhost:4500${server.graphqlPath}`);
// 					});
// 				} catch (errServer) {
// 					console.log('se ha presentado un error al encender la Aplicación.');
// 					console.log(`El error es ${errServer}`);
// 					throw errServer;
// 				}
// 			}
// 		});
// 	})
// 	.catch(err => {
// 		if (err) {
// 			console.log('se ha presentado un error al conectarse a Postgress.');
// 			console.log(`El error es ${err}`);
// 			throw err;
// 		}
// 	});
