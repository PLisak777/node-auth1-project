const router = require('express').Router();
const protect = require('../auth/restricted-middleware');

const Users = require('./usersModel');

router.get('/', protect, (req, res) => {
	Users.find((users) => {
		res.status(200).json(users);
	}).catch((err) => res.send(err));
});

module.exports = router;
