const router = require('express').Router();
const users = require('../users/usersModel');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
	let user = req.body;
	const hash = bcrypt.hashSync(user.password, 12);
	user.password = hash;

	try {
		const saved = await users.add(user);
		res.status(201).json(saved);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

router.post('/login', async (req, res) => {
	let { username, password } = req.body;

	try {
		const user = await users.findBy({ username }).first();
		if (user && bcrypt.compareSync(password, user.password)) {
			req.session.user = user;
			res.status(200).json({
				message: `Logged in. Welcome, ${user.username} :)`,
			});
		} else {
			res.status(401).json({
				message: 'You shall not pass!',
			});
		}
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

router.get('/logout', (req, res) => {
	if (req.session && req.session.user) {
		req.session.destroy((err) => {
			if (err) {
				res.send('Something went wrong!', err);
			} else {
				res.send('Bye Felicia');
			}
		});
	} else {
		res.end();
	}
});

module.exports = router;
