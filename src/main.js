'use strict';
/* Import Modules */
import dotenv from 'dotenv';
import express from 'express';
import RateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import main from './routers/main.js';
import error from './routers/404.js';
import sitemap from './routers/sitemap.js';
import database from './database/index.js';
import Store from 'connect-mongo';
import session from 'express-session';
dotenv.config();

/* Making Constants */
const app = express();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Setting up rate limiter: maximum of hundered requests per hour */
const limiter = new RateLimit({
	// 1  Hour
	windowMs: 60 * 60 * 1000,
	max: 1000,
});

/* Setting up the Cookies */
app.use(session({
	secret: process.env.SECRET,
	saveUninitialized: false,
	resave: false,
	name: 'Puppala Koushik',
	store: Store.create({
		mongoUrl: `${process.env.MONGODB_URL}`,
	}),
}));

/* Setting up the Environment */
app.use(limiter);
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	}),
);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
database();

/* Setting up the Pages */
app.use('/', main);
app.use('/sitemap.xml', sitemap);
app.use('/arc-sw.js', (req, res) => {
	res.sendFile(path.join(__dirname, '/arc-sw.js'));
});
app.get('/robots.txt', (req, res) => {
	res.sendFile(path.join(__dirname + '/robots.txt'));
});
app.get('*', error);

/* Running the server */
app.listen(port, () => {
	console.log(`Website is running at http://localhost:${port}`);
});
