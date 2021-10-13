import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import productsRoutes from './routes/products-routes.js';
import ordersRoutes from './routes/orders-routes.js';
import shippingsRoutes from './routes/shippings-routes.js';
import usersRoutes from './routes/users-routes.js';
import HttpError from './models/http-error.js';

const app = express();
dotenv.config();

app.use(express.json());

// Setting Headers to every response of the server
app.use((req, res, next) => {console.log('headersSET1');
	res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL); // * => this is the domain
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	console.log('headersSET2');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	console.log('headersSET3');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
	console.log('headersSET4');
	next();
});

app.use(`/api/${process.env.API_VERSION}/products`, productsRoutes);
app.use(`/api/${process.env.API_VERSION}`, ordersRoutes);
app.use(`/api/${process.env.API_VERSION}`, shippingsRoutes);
app.use(`/api/${process.env.API_VERSION}/users`, usersRoutes);

// default error if route not handled
app.use((error, req, res, next) => {
	throw new HttpError('Could not find this route.', 404);
});

app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || 'An unknown error occured!' });
});

// connect to mongodb
mongoose
	.connect(
		`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.93gb7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
	)
	.then(() => {
		console.log('connected to db!');

		// listen to requests
		app.listen(process.env.PORT || 5000);
	})
	.catch((err) => {
		console.log('connection failed: ', err);
	});
