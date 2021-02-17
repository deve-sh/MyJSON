/*
	File housing all the custom generator functions.
	Used primarily in /api/getjson route.
*/

const dataGen = require("./dataGen");
const bCrypt = require("bcrypt"); // For Hashing the Fake Passwords.
const { errors } = require("../errors");

function customGen(req, res, fields = {}, serialCount = 0, nobjects = 1) {
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
	      },
	      "username": {
			"type": "text-unspaced"
	      }
	    },
	    "n" : 10
  	}
	   -------------------
	*/

	let fieldOb = {};

	for (let field in fields) {
		if (fields.hasOwnProperty(field) && field !== "n") {
			// Checking the type of field.

			let fieldType = fields[field].type.toLowerCase();

			if (fieldType === "text") {
				// If the field is a textfield.

				switch (fields[field].choice) {
					case "w":
					case "W":
					case "words":
					case "Words":
					case "WORDS":
						if (fields[field].n) {
							n =
								fields[field].n > 0 && fields[field].n <= 50
									? fields[field].n
									: 40;
							fieldOb[field] = dataGen.getLoremIpsum(
								false,
								true,
								n
							);
						} else {
							fieldOb[field] = dataGen.getLoremIpsum(false, true);
						}
						break;
					case "p":
					case "P":
					case "para":
					case "Para":
					case "PARA":
						if (field.n) {
							n = field.n > 0 && field.n <= 10 ? field.n : 10;
							fieldOb[field] = dataGen.getLoremIpsum(
								true,
								false,
								n
							);
						} else {
							fieldOb[field] = dataGen.getLoremIpsum(true, false);
						}
						break;
					default:
						fieldOb[field] = dataGen.getLoremIpsum(); // Just give the default text.
				}
			} else if (fieldType === "text-unspaced") {
				// If the field is to be a text field, but without spaces and meaning.

				if (
					Number(fields[field]["length"]) &&
					(Number(fields[field]["length"]) > 0 &&
						Number(fields[field]["length"]) < 256)
				) {
					fieldOb[field] = dataGen.generateText(fields[field].length);
				} else {
					// Generate a random length of unspaced text and send it.

					const [minLen, maxLen] = [6, 15];

					fieldOb[field] = dataGen.generateText(
						Math.floor(Math.random() * (maxLen - minLen) + minLen)
					);
				}
			} else if (fieldType === "uuid") {
				fieldOb[field] = dataGen.generateUUID();
			} else if (fieldType === "password" || fieldType === "pass") {
				// If the user needs a password field. Then we will send a hashed password.

				let randPass = dataGen.randomPass(!!fields[field].randomLength);

				let hash = bCrypt.hashSync(randPass, 10); // Hash the password using bcrypt.

				fieldOb[field] = hash;
			} else if (fieldType === "email") {
				// Email
				let nameLength = 6,
					name = "";
				if (fields[field]["nameLength"]) {
					nameLength =
						Math.abs(Number(fields[field]["nameLength"])) || 6;
				}
				name = dataGen.generateText(nameLength);
				let mainBody = "";
				if (fields[field]["serviceProvider"]) {
					mainBody = fields[field]["serviceProvider"];
				} else {
					mainBody =
						dataGen.generateText(6) +
						"." +
						(fields[field]["tld"] ? fields[field]["tld"] : "com");
				}

				fieldOb[field] = name + "@" + mainBody;
			} else if (fieldType === "boolean")
				fieldOb[field] = Math.random() >= 0.5 ? true : false;
			// Give a random boolean.
			else if (fieldType === "number") {
				if (fields[field].range && Array.isArray(fields[field].range)) {
					// If the user has passed a range for the numbers.

					let min = Number(fields[field].range[0]);
					let max = Number(fields[field].range[1]);

					if (
						!min ||
						!max ||
						min === max ||
						(fields[field].hasOwnProperty("serial") &&
							fields[field].serial === true &&
							Math.abs(max - min) < nobjects)
					)
						res.status(400).json({ error: errors.INVALIDRANGE });

					if (min > max) [min, max] = [max, min];

					min = Math.ceil(min);
					max = Math.floor(max);

					fieldOb[field] =
						fields[field].serial === true
							? serialCount + min
							: !fields[field].floating
							? Math.floor(Math.random() * (max - min)) + min
							: Math.random() * (max - min) + min; // Generated a random number in the range.
				} else if (fields[field].serial === true) {
					// If the data is to be serial.

					fieldOb[field] = serialCount;
				} else {
					fieldOb[field] = !fields[field].floating
						? Math.floor(Math.random() * 10)
						: Math.random() * 10;
				}
			}
		}
	}

	return fieldOb;
}

module.exports = {
	abs: Math.abs,
	customGen,
};
