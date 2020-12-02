const express = require('express');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const helmet = require('helmet');
const cors = require('cors');

const usersRouter = require('../users/usersRouter');
const authRouter = require('../auth/authRouter');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

const sessionConfig = {
	name: 'plsession',
	secret: 'stop lookin at my lunch',
	cookie: {
		maxAge: 3600 * 1000,
		secure: false,
		httpOnly: true,
	},
	resave: false,
	saveUninitialized: false,

	store: new KnexSessionStore({
		knex: require('../database/db-config'),
		tableName: 'sessions',
		sidFieldName: 'sid',
		createTable: true,
		clearInterval: 3600 * 1000,
	}),
};

server.use(session(sessionConfig));
server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
	res.json({ api: 'running' });
});

module.exports = server;
