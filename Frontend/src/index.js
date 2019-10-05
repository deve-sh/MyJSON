import React, { useEffect } from "react";
import ReactDOM from "react-dom";

// Dark Mode Setters.

import { getDarkMode, toggleDarkMode } from "./darkMode";

// Components.

import Header from "./components/header/header";
import Introducer from "./components/introducer/introducer";
import Tryout from "./components/tryout/tryout";

// Styling

import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";

const App = props => {
  useEffect(() => {
    getDarkMode(); // Set the dark mode if the user opted for it previously.
  }, []);

  return (
    <React.Fragment>
      <Header toggleDarkMode={toggleDarkMode} />
      <Introducer />
      <Tryout />
    </React.Fragment>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
