import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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

app.post('/auth/login', (req, res) => {
	const token = jwt.sign({
		email: req.body.email,
		password: req.body.password
	}, 'secret');
	res.json({
		success: true,
		token
	});
});

app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log('server ok');
});