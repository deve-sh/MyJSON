import React from "react";

const Response = props => {
  return (
    <div className={"responseContainer"}>
      {props.errorMessage ? (
        <div className={"alert alert-danger"}>{props.errorMessage}</div>
      ) : (
        ""
      )}

      {props.response ? (
        <div className={"alert alert-success"}>{props.response}</div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Response;
