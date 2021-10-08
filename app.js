import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import productsRoutes from './routes/products-routes.js';
import HttpError from './models/http-error.js';

const app = express();
dotenv.config();

app.use(express.json());

// Setting Headers to every response of the server
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*'); // * => this is the domain
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
	next();
});

app.use('/api/v1', productsRoutes);
// app.use('/api/v1', ordersRoutes);

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
	.connect(process.env.DB_URL)
	.then(() => {
		console.log('connected to db!');

		// listen to requests
		app.listen(5000);
	})
	.catch((err) => {
		console.log('connection failed: ', err);
	});
