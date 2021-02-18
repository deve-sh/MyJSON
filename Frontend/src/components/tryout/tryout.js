// Container for the tryout part of the web app.

import React, { useState } from "react";

import Form from "../form/form";
import Response from "../response/response";
import requester from "../../helpers/requester";

const Tryout = props => {
  const [errorMessage, seterrorMessage] = useState("");
  const [response, setresponse] = useState("");
  const [jsontoSend, setjsontoSend] = useState(`{
    "fields" : {
      "ID": {
        "type": "number",
        "range": [10,25],
        "serial" : true
      },
      "uid": {
        "type": "uuid"
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
  }`);

  const getResponse = res => {
    if (res.status === 200) {
      console.log(JSON.parse(res.response));
      setresponse(
        "The API Request is done. Open your console and check it out."
      );
      seterrorMessage("");
    } else {
      seterrorMessage(JSON.parse(res.response)["error"]);
      setresponse("");
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    let isValid = true;

    try {
      // Checking if valid JSON.
      JSON.parse(jsontoSend);
    } catch (err) {
      seterrorMessage("Invalid JSON"); // Error in parsing the JSON.
      isValid = false;
    }

    if (isValid) requester(jsontoSend, getResponse);
  };

  return (
    <div id="tryOut" style={{ textAlign: "center" }}>
      <div className="fixedContainer">
        <h2>Try it Out</h2>
        <p>Give the Endpoint a try with its flexibility.</p>

        <Form
          handleSubmit={handleSubmit}
          jsontoSend={jsontoSend}
          setjsontoSend={setjsontoSend}
        />
        <br />
        <Response errorMessage={errorMessage} response={response} />
      </div>
    </div>
  );
};

export default Tryout;
