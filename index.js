import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import { registerValidation } from './validations/auth.js';

import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';

// подключение к MongoDB
mongoose.connect('mongodb+srv://admin:admin@cluster0.pooahs5.mongodb.net/blog?retryWrites=true&w=majority')
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
// авторизация
app.post('/auth/login', async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email });

		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			});
		}

		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

		if (!isValidPass) {
			return res.status(403).json({
				message: 'Неверный пароль',
			});
		}

		const token = jwt.sign({
			_id: user._id,
		},
			'secret',
			{
				expiresIn: '30d',
			}
		);

		const { passwordHash, ...userData } = user._doc;

		res.json({
			...userData,
			token,
		});

	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось авторизоваться',
		});
	}
});
// регистрация
app.post('/auth/register', registerValidation, async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const doc = new UserModel({
			email: req.body.email,
			passwordHash: hash,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl
		});

		const user = await doc.save();
		const token = jwt.sign({
			_id: user._id,
		},
			'secret',
			{
				expiresIn: '30d',
			}
		);

		const { passwordHash, ...userData } = user._doc;

		res.json({
			...userData,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось зарегистрироваться',
		});
	}
});
// информация о пользователе 
app.get('/auth/me', checkAuth, async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId);

		if (!user) {
			return res.status(404).json({
				message: "Пользователь не найден",
			})
		}

		const { passwordHash, ...userData } = user._doc;

		res.json({
			...userData,
		});
	} catch (error) {
		console.log(error);
	}
});
app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log('server ok');
});