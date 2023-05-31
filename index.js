import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import { registerValidation } from './validations/auth.js';

mongoose.connect('mongodb+srv://admin:admin@cluster0.pooahs5.mongodb.net/?retryWrites=true&w=majority')
	.then(() => {
		console.log('connect to MongoDB');
	}).catch((err) => {
		console.log('DB error', err);
	});

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hi Node Js and nodemon')
});

app.post('/auth/register', registerValidation, (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array());
	}

	res.json({
		success: true,
	});
});

app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log('server ok');
});