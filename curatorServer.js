const express = require('express')
const app = express();
const port = process.env.PORT || 5000

app.use(express.static('build'))

// app.post('/user', (req, res) => {
// 	User.create({
// 		username: req.body.username,
// 		password: req.body.password
// 	}).then(user => res.json(user));
// });

const { check, validationResult } = require('express-validator/check');

app.post(
	'/user',
	[
		// username must be an email.
		check('username').isEmail(),
		// password must be at least 8 characters long.
		check('password').isLength({ min: 8 })
	],
	(req, res) => {
		console.log(req, res)
		// finds the validation errors in request.
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({
				errors: errors.array()
			});
		}
		User.create({
			username: req.body.username,
			password: req.body.password
		}).then(user => res.json(user));
	}
);

app.listen(port, () => console.log(`Startup-Vermont app listening on port ${port}!`));