import PostModel from '../models/Post.js'

// создание статьи
export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags,
			imageUrl: req.body.imageUrl,
			user: req.userId,
		})

		const post = await doc.save()

		res.json(post)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: "Не удалось создать статью" })
	}
}

// получение всех статей 
export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec()

		res.json(posts)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: "Не получить все статьи" })
	}
}

// получение одной статьи
export const getOne = (req, res) => {
	try {
		const postId = req.params.id;
		PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: 'after',
			},
		).then((err, doc) => {
				if (!err) {
					console.log(err)
					return res.status(500).json({ message: "Не удалось получить статью 1" })
				}

				if (!doc) {
					return res.status(404).json({
						message: "Статья не найдена"
					})
				}
				console.log(doc)
				res.json(doc)
			},
		)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: "Не удалось получить статью 2" })
	}
}

// удаление статьи