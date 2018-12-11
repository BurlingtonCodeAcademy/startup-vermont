import express from 'express';

const express = require('express');
const app = express();

app.use(express.json());
app.post('/user', (req, res) => {
	User.create({
		username: req.body.username,
		password: req.body.password
	}).then(user => res.json(user));
});

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
