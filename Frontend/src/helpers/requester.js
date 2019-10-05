// File to house the function that is to be used to send the request.

import { AJAX } from "lesser.js";
import config from "../config";

export default function(data = `{}`, callback = () => {}) {
  const endpoint = `${config.HTTP}${config.BACKENDURL}${config.GETJSON}`;

  AJAX(
    "POST",
    endpoint,
    res => {
      callback(res);
    },
    data
  );
}
