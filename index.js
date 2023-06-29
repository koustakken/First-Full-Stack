import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
// TODO добавить dotenv

// валидация
import { registerValidation, loginValidation, postCreateValidation } from './validation.js';
// утилиты
import checkAuth from './utils/checkAuth.js';
import handleValidationErors from './utils/handleValidationErors.js';
// контроллеры
import { register, login, getMe } from './controllers/UserController.js';
import { create, getAll, getOne, remove, update } from './controllers/PostController.js';

// подключение к MongoDB
mongoose.connect('mongodb+srv://admin:admin@cluster0.pooahs5.mongodb.net/blog?retryWrites=true&w=majority')
	.then(() => {
		console.log('connect to MongoDB');
	}).catch((err) => {
		console.log('DB error', err);
	});

const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	}
})

const upload = multer({ storage })

app.use(express.json());
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
	res.send('Hi Node Js')
});
// авторизация
app.post('/auth/login', loginValidation, handleValidationErors, login);
// регистрация
app.post('/auth/register', registerValidation, handleValidationErors, register);
// загрузка изображения
app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`
	})
});
// информация о пользователе 
app.get('/auth/me', checkAuth, getMe);
// посты
app.get('/posts', getAll);
app.get('/posts/:id', getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErors, create);
app.delete('/posts/:id', checkAuth, remove);
app.patch('/posts/:id', checkAuth, handleValidationErors, update);

app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log('server ok');
});