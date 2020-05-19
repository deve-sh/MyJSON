// Presentational component for the introducer component.

import React from "react";
import BrowserWindow from "../BrowserWindow/browserwindow";

const Introducer = props => {
  return (
    <div id="introducer">
      <br />
      <br />
      <br />
      {/* First Component for introduction. */}
      <div className="fixedContainer">
        <h1>MyJSON</h1>
        <br />
        <p>A simple solution for your data hungry app.</p>
        <p>Generate fake JSON data tailored to your needs.</p>
        <br />
        <BrowserWindow />
      </div>
    </div>
  );
};

export default Introducer;
