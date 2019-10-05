/*
	REST API for CustomJSON for anyone.
*/

// Dependencies

const express = require('express');
const bCrypt = require('bcrypt');			// Hashing fake passwords.
const bodyParser = require('body-parser');	// For parsing data in the body of POST, PUT and DELETE requests.
const dotenv = require('dotenv').config();	// For reading from .env
const helmet = require('helmet');		// For security of the app.
const cors = require('cors');			// For accepting requests from anywhere.
const dataGen = require('./dataGen');	// Functions to generate custom data.

// Instantiating

const app = express();

// Port

const PORT = process.env.PORT || 4567;

// Middlewares

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

// Routes

app.get('/', (req, res) => {
	res.json({message : "Welcome, route to routes specified in the documentation to see the magic."});
});

const abs = num => num<0 ? -num : num;		// Absolute function for a strictly positive number.

function customGen(req, res, fields = {}, serialCount = 1, nobjects = 1){
	// Function to generate custom data for sending, it takes req, res and fields of the options received from the post request as its arguments.

	/* -------------------
		Example request JSON : 

	{
	    "fields" : {
	      "ID": {
	    	"type": "number",
	        "range": [10,25],
	        "serial" : true
	      },
	      "name": {
	        "type": "text",
	        "choice" : "words",
	        "n" : 2
	      },
	      "password" : {
	        "type" : "password",
	        "randomLength" : false,
	        "length": 5
	      }
	    },
	    "n" : 10
  	}
	   -------------------
	*/

	let fieldOb = {};
	
	for(let field in fields){

		if(fields.hasOwnProperty(field) && field !== "n"){

			// Checking the type of field.

			if(fields[field].type.toLowerCase() === 'text'){
				// If the field is a textfield.

				switch(fields[field].choice){
					case "w":
					case "W":
					case "words":
					case "Words":
					case "WORDS": if(fields[field].n){
									n = (fields[field].n > 0 && fields[field].n <= 50)?fields[field].n:40;
									fieldOb[field] = dataGen.getLoremIpsum(false, true, n);
								  }
								  else{
								  	fieldOb[field] = dataGen.getLoremIpsum(false,true);
								  }
								  break;
					case "p":
					case "P":
					case "para":
					case "Para":
					case "PARA": if(field.n){
								 	n = (field.n > 0 && field.n <= 10)?field.n:10;
									fieldOb[field] = dataGen.getLoremIpsum(true,false, n);
								  }
								  else{
								  	fieldOb[field] = dataGen.getLoremIpsum(true,false);
								  }
								 break;
					default : fieldOb[field] = dataGen.getLoremIpsum();		// Just give the default text.
				}
			}
			else if(fields[field].type.toLowerCase() === 'boolean'){
				fieldOb[field] = (Math.random() >= 0.5)?true:false;	// Give a random boolean.
			}
			else if(fields[field].type.toLowerCase() === 'number'){

				if(fields[field].range && Array.isArray(fields[field].range)){
					// If the user has passed a range for the numbers.

					let min = Number(fields[field].range[0]);
					let max = Number(fields[field].range[1]);

					if(!min 
						|| !max 
						|| min === max 
						|| (
								fields[field].hasOwnProperty('serial') 
								&& fields[field].serial === true
								&& abs(max - min) < nobjects
							)
						)
						res.status(400).json({error: "Range invalid."});

					if(min > max)
						[min, max] = [max, min];

					min = Math.ceil(min);
    				max = Math.floor(max);

    				fieldOb[field] = fields[field].serial === true 
    									? serialCount + min 
    									: Math.floor(Math.random() * (max - min + 1)) + min;		// Generated a random number in the range.
				}
				else if(fields[field].serial === true){
					// If the data is to be serial.

					fieldOb[field] = serialCount;
				}
				else{
					fieldOb[field] = Math.floor(Math.random()*10);
				}
			}
			else if(
				fields[field].type.toLowerCase() === 'password' 
				|| fields[field].type.toLowerCase() === 'pass'
			){
				// If the user needs a password field. Then we will send a hashed password.

				let randPass = dataGen.randomPass();

				if(fields[field].randomLength === true)
					randPass = dataGen.randomPass(true);

				let hash = bCrypt.hashSync(randPass, 10);		// Hash the password using bcrypt.

				fieldOb[field] = hash;
			}
			else if(fields[field].type.toLowerCase() === 'text-unspaced'){
				// If the field is to be a text field, but without spaces and meaning.

				if(Number(fields[field].len) && (Number(fields[field].len) > 0 && Number(fields[field].len) < 256)){
					fieldOb[field] = dataGen.generateText(fields[field].len);
				}
				else{
					res.status(400).json({error: "Invalid Length for text."});
					return;
				}
			}
		}
	}

	return fieldOb;
}

app.post('/api/getjson', (req, res) => {
	// Main route to get the Custom JSON.

	if(!req.body.fields){
		res.status(400).json({error: "Invalid request. POST an object of fields."});
	}
	else{
		let { fields } = req.body;

		if(Object.keys(fields).length < 10){
			let dataToSend = [];

			if(!fields){
				res.status(400).json({error: "Invalid Request."});
				return;
			}

			if(Number(req.body.n) && req.body.n > 0 && req.body.n <= 50){
				for(let i = 0;i<req.body.n;i++){
					dataToSend.push(customGen(req, res, fields,i + 1, req.body.n));	// Generate entries one by one.
				}
			}
			else{
				res.status(400).json({error: "Invalid Number of Data Packets Requested."});
				return;
			}

			res.json(dataToSend);
		}
		else{
			res.status(400).json({error: "Can't have more than 10 fields."});
		}
	}
});

/*
	Other simpler routes to get posts and todos with a preset template.
*/

app.get('/api/posts', (req,res) => {
	// Route to get a specified number of posts.

	let totalNum = 25;	// The total number of posts to be sent is 25 by default.

	if(req.query.n){
		totalNum = req.query.n;
	}

	if(totalNum>50)
		res.status(400).json({error: "Too many posts requested."});
	else if(totalNum<=0)
		res.status(400).json({error: "Invalid number of posts requested."});

	// Now generating the random posts.

	let posts = [], userIDCount = 1;

	for(let i = 0;i<totalNum;i++){
		if(i%10 == 0 && i>0)
			userIDCount++;

		posts.push({
			postId : i + 1,
			userId : userIDCount,
			content: dataGen.getLoremIpsum(),		// Get two paragraphs of lorem ipsum.
			created: new Date(Date.now() - Math.floor(Math.random() * 84600*24*7*52)).toLocaleString()
		});
	}

	res.json({posts});
});

app.get('/api/todos', (req,res) => {
	// Route to get a specified number of todos.

	let totalNum = 25;	// The total number of todos to be sent is 25 by default.

	if(req.query.n){
		totalNum = req.query.n;
	}

	if(totalNum>50)
		res.status(400).json({error: "Too many todos requested."});
	else if(totalNum<=0)
		res.status(400).json({error: "Invalid number of todos requested."});

	// Now generating the random todos.

	let todos = [], userIDCount = 1;

	for(let i = 0;i<totalNum;i++){
		if(i%10 == 0 && i>0)
			userIDCount++;

		todos.push({
			Id : i + 1,
			userId : userIDCount,
			todo: dataGen.getLoremIpsum(false, true, 10),		// Get 10 words for the todo.
			completed : (Math.random() >= 0.5)?true:false
		});
	}

	res.json({todos});
});

// Listening on the PORT

app.listen(PORT, () => {
	console.log("Listening at " + PORT);
});