// File to house the function that is to be used to send the request.

import { AJAX } from "lesser.js";
import config from "../config";

export default function(data = `{}`, callback = () => {}) {
	const endpoint = `${
		process.env.NODE_ENV === "production" ? config.HTTPS : config.HTTP
	}${
		process.env.NODE_ENV === "production"
			? config.REMOTEBACKEND
			: config.BACKENDURL
	}${config.GETJSON}`;

	AJAX(
		"POST",
		endpoint,
		(res) => {
			callback(res);
		},
		data
	);
}
