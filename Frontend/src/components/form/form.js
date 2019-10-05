// File to house the Form that will contain the inputs for sending to the endpoint.

import React, { useState, useEffect } from "react";

// Config
import config from "../../config";

// Codemirror
import CodeMirror from "react-codemirror";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css"; // Later to be changed to a modern version of VS Code.

require("codemirror/mode/javascript/javascript");

const Form = props => {
  const handleChange = newJSON => {
    props.setjsontoSend(newJSON);
  };

  const textboxOptions = {
    mode: config.TEXTAREAMODE,
    lineNumbers: true,
    theme: config.TEXTAREATHEME
  };

  return (
    <form
      action={""}
      id={"tryoutForm"}
      className={"textareacontainer"}
      method={"POST"}
      onSubmit={props.handleSubmit}
    >
      <CodeMirror
        options={textboxOptions}
        value={props.jsontoSend}
        onChange={handleChange}
      />
      <br />
      <button className={"btn btn-primary"} type={"submit"}>
        Send Request
      </button>
    </form>
  );
};

Form.defaultProps = {
  handleSubmit: () => {}
};

export default Form;
