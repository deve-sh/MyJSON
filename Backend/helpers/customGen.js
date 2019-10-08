/*
	File housing all the custom generator functions.
	Used primarily in /api/getjson route.
*/

const dataGen = require("./dataGen");
const bCrypt = require("bcrypt");	// For Hashing the Fake Passwords.

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
			else if(
				fields[field].type.toLowerCase() === 'boolean' || 
				fields[field].type.toLowerCase() === 'boolean'
			){
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

module.exports = {
	abs,
	customGen
}