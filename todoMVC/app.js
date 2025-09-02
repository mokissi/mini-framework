import { useState } from "../framework/state.js";
import { renderApp } from "../framework/render.js";


// Helper function to re-render
function update() {
  const appContainer = document.getElementById("app");
  renderApp(App, appContainer);
}