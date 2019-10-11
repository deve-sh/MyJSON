/*
	REST API for CustomJSON for anyone.
*/

// Dependencies

const express = require("express");
const bodyParser = require("body-parser"); // For parsing data in the body of POST, PUT and DELETE requests.
const dotenv = require("dotenv").config(); // For reading from .env
const helmet = require("helmet"); // For security of the app.
const cors = require("cors"); // For accepting requests from anywhere.

const { config } = require("./config");
const { errors } = require("./errors");

const { dataGen } = require("./helpers/dataGen"); // Functions to generate data.
const { customGen } = require("./helpers/customGen");

// Instantiating

const app = express();

// Port

const PORT = process.env.PORT || config.PORT;

// Middlewares

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes

app.get("/", (req, res) => {
	res.json({
		message:
			"Welcome, route to routes specified in the documentation to see the magic."
	});
});

app.post("/api/getjson", (req, res) => {
	// Main route to get the Custom JSON.

	if (!req.body.fields) {
		res.status(400).json({ error: errors.INVALIDFIELDREQ });
	} else {
		let { fields } = req.body;

		if (Object.keys(fields).length < 10) {
			let dataToSend = [];

			if (!fields) {
				res.status(400).json({ error: errors.INVALIDREQ });
				return;
			}

			if (Number(req.body.n) && req.body.n > 0 && req.body.n <= 50) {
				for (let i = 0; i < req.body.n; i++) {
					dataToSend.push(customGen(req, res, fields, i, req.body.n)); // Generate entries one by one.
				}
			} else {
				res.status(400).json({ error: errors.INVALIDNOBS });
				return;
			}

			res.json(dataToSend);
		} else {
			res.status(400).json({ error: errors.TOOMANYFIELDS });
		}
	}
});

/*
	Other simpler routes to get posts and todos with a preset template.
*/

app.get("/api/posts", (req, res) => {
	// Route to get a specified number of posts.

	let totalNum = 25; // The total number of posts to be sent is 25 by default.

	if (req.query.n) {
		totalNum = req.query.n;
	}

	if (totalNum > 50) res.status(400).json({ error: errors.TOOMANYPOSTS });
	else if (totalNum <= 0)
		res.status(400).json({ error: errors.INVALIDNPOSTS });

	// Now generating the random posts.

	let posts = [],
		userIDCount = 1;

	for (let i = 0; i < totalNum; i++) {
		if (i % 10 == 0 && i > 0) userIDCount++;

		posts.push({
			postId: i + 1,
			userId: userIDCount,
			content: dataGen.getLoremIpsum(), // Get two paragraphs of lorem ipsum.
			created: new Date(
				Date.now() - Math.floor(Math.random() * 84600 * 24 * 7 * 52)
			).toLocaleString()
		});
	}

	res.json({ posts });
});

app.get("/api/todos", (req, res) => {
	// Route to get a specified number of todos.

	let totalNum = 25; // The total number of todos to be sent is 25 by default.

	if (req.query.n) {
		totalNum = req.query.n;
	}

	if (totalNum > 50) res.status(400).json({ error: errors.TOOMANYTODOS });
	else if (totalNum <= 0)
		res.status(400).json({ error: errors.INVALIDNTODOS });

	// Now generating the random todos.

	let todos = [],
		userIDCount = 1;

	for (let i = 0; i < totalNum; i++) {
		if (i % 10 == 0 && i > 0) userIDCount++;

		todos.push({
			Id: i + 1,
			userId: userIDCount,
			todo: dataGen.getLoremIpsum(false, true, 10), // Get 10 words for the todo.
			completed: Math.random() >= 0.5 ? true : false
		});
	}

	res.json({ todos });
});

// Listening on the PORT

app.listen(PORT, () => {
	console.log("Listening at " + PORT);
});
