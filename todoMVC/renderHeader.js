import { useState } from "../framework/state.js";
import { renderApp } from "../framework/render.js";
import { Root } from "./app.js";

// --- States ---
export const [getInput, setInput] = useState("taskInput", "");
export const [getTasks, setTasks] = useState("tasks", []);


// Helper function to re-render
export function update() {
  const appContainer = document.body;
  renderApp(Root, appContainer);
}

// Header component - handles the title and new todo input
export function renderHeader() {
  let inputRef = (el) => el && el.focus();
  return {
    type: "header",
    props: { class: "header", "data-testid": "header" },
    children: [
      { type: "h1", props: {}, children: ["todos"] },
      {
        type: "div",
        props: { class: "input-container" },
        children: [
          {
            type: "input",
            props: {
              class: "new-todo",
              id: "todo-input",
              type: "text",
              "data-testid": "text-input",
              placeholder: "What needs to be done?",
              autofocus: true,
              ref: inputRef,
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
          },
          {
            type: "label",
            props: {
              class: "visually-hidden",
              for: "todo-input"
            },
            children: ["New Todo Input"]
          }
        ]
      }
    ]
  };
}
