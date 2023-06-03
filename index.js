import express from 'express';
import mongoose from 'mongoose';

// валидация
import { registerValidation } from './validations/auth.js';
// утилиты
import checkAuth from './utils/checkAuth.js';
// контроллеры
import { register, login, getMe } from './controllers/UserController.js';

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
app.post('/auth/login', login);
// регистрация
app.post('/auth/register', registerValidation, register);
// информация о пользователе 
app.get('/auth/me', checkAuth, getMe);

app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log('server ok');
});