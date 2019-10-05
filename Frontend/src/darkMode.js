// File for housing the function to set the dark mode for the app.

import { get, loop } from "lesser.js";

export function isDark() {
  // Function to check if dark mode is set in the app.

  return localStorage.getItem("app-isDark") === "true";
}

export function toggleDarkMode() {
  // Function to toggle the dark mode.

  if (!isDark()) {
    get("body")[0].classList.add("darkbody");
    // get(".responseBox")[0].classList.add("darkcode");

    localStorage.setItem("app-isDark", "true"); // Add a marker.
  } else {
    get("body")[0].classList.remove("darkbody");
    // get(".responseBox")[0].classList.remove("darkcode");

    localStorage.removeItem("app-isDark"); // Remove the marker.
  }
}

export function getDarkMode() {
  // Function to check if dark mode is enabled, it yes, then enable it on load of the component.

  if (isDark()) {
    get("body")[0].classList.add("darkbody");
  }
}
