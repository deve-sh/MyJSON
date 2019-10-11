/*
	A module of functions to generate random custom data, to be later sent into the JSON response of the user.
*/

const LoremIpsum = require("lorem-ipsum").LoremIpsum; // Module to generate lorem ipsum text.

const lorem = new LoremIpsum({
	// Configuring the Lorem Ipsum generator.
	sentencesPerParagraph: {
		max: 8,
		min: 4
	},
	wordsPerSentence: {
		max: 10,
		min: 4
	}
});

function randomPass(randomLength = false, length = 8) {
	// Function to generate a random password.

	const chars =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZY1234567890!@#$%^&*()_+{}[.]:'"; // Valid List of Characters to form the password out of.

	let randomPassword = "",
		randomLen;

	if (randomLength === true) {
		// If the user opted for varying lengths of password.
		// Then generate a password of length anywhere between 6 characters to 14 characters.

		randomLen = Math.floor(Math.random() * 9) + 6;
		length = randomLen;
	}

	for (let i = 0; i < length; i++) {
		randomPassword += chars[Math.floor(Math.random() * chars.length)];
	}

	return randomPassword;
}

function generateText(length = 20) {
	// Function to generate random text.
	// Without spaces and special characters.

	const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZ";
	let text = "";

	for (let i = 0; i < length; i++) {
		text += alphabets[Math.floor(Math.random() * alphabets.length)];
	}

	return text;
}

function getLoremIpsum(paragraph = true, words = false, n = 2) {
	if (paragraph && words) {
		return false;
	} else if (!paragraph && !words) {
		return false;
	}

	if (paragraph) {
		return lorem.generateParagraphs(n);
	} else {
		return lorem.generateWords(n);
	}
}

module.exports = {
	getLoremIpsum,
	randomPass,
	generateText
};
