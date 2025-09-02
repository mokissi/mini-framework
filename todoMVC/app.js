import { useState } from "../framework/state.js";
import { renderApp } from "../framework/render.js";

import { useRoute, onRouteChange, navigate, initRouter } from "../framework/router.js";

// --- States ---
const [getInput, setInput] = useState("taskInput", "");
const [getTasks, setTasks] = useState("tasks", []);
const [getFilter, setFilter] = useState("filter", "all");
const [getEditing, setEditing] = useState("editing", null);

// Helper function to re-render
function update() {
  const appContainer = document.getElementById("app");
  renderApp(App, appContainer);
}

// Header component - handles the title and new todo input
function renderHeader() {
  return {
    type: "header",
    props: { class: "header" },
    children: [
      { type: "h1", props: {}, children: ["todos"] },
      {
        type: "input",
        props: {
          class: "new-todo",
          placeholder: "What needs to be done?",
          autofocus: true,
          value: getInput(),
          oninput: (e) => setInput(e.target.value),
          onkeydown: (e) => {
            if (e.key === "Enter" && getInput().trim().length >= 2) {
              setTasks([
                ...getTasks(),
                { id: Date.now(), text: getInput().trim(), completed: false }
              ]);
              setInput("");
              update();
            }
          }
        },
        children: []
      }
    ]
  };
}
