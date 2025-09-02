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

// Main section component - handles the todo list and toggle all functionality
function renderMainSection(tasks, visibleTasks, editing, filter) {
  if (tasks.length === 0) return [];

  return [
    {
      type: "section",
      props: { class: "main" },
      children: [
        {
          type: "input",
          props: {
            id: "toggle-all",
            class: "toggle-all",
            type: "checkbox",
            checked: tasks.every((t) => t.completed),
            onchange: () => {
              const allDone = tasks.every((t) => t.completed);
              setTasks(tasks.map((t) => ({ ...t, completed: !allDone })));
              update();
            }
          },
          children: []
        },
        {
          type: "label",
          props: { for: "toggle-all" },
          children: ["Mark all as complete"]
        },
        {
          type: "ul",
          props: { class: "todo-list" },
          children: visibleTasks.map((task, idx) => {
            const realIdx = tasks.indexOf(task);

            return {
              type: "li",
              props: {
                key: task.id,
                class: [
                  task.completed ? "completed" : "",
                  editing === realIdx ? "editing" : ""
                ].filter(Boolean).join(" ")
              },
              children: [
                {
                  type: "div",
                  props: { class: "view" },
                  children: [
                    {
                      type: "input",
                      props: {
                        id: realIdx,
                        class: "toggle",
                        type: "checkbox",
                        checked: task.completed,
                        onchange: () => {
                          const newTasks = [...tasks];
                          newTasks[realIdx].completed = !newTasks[realIdx].completed;
                          setTasks(newTasks);
                          update();
                        }
                      },
                      children: []
                    },
                    {
                      type: "label",
                      props: {
                        ondblclick: () => {
                          setEditing(realIdx);
                          update();
                          setTimeout(() => {
                            const editInput = document.querySelector(".edit");
                            if (editInput) {
                              editInput.focus();
                              editInput.select();
                            }
                          }, 0);
                        }
                      },
                      children: [task.text]
                    },
                    {
                      type: "button",
                      props: {
                        class: "destroy",
                        onclick: () => {
                          const newTasks = tasks.filter((_, i) => i !== realIdx);
                          setTasks(newTasks);
                          update();
                        }
                      },
                      children: []
                    }
                  ]
                },
                ...(editing === realIdx
                  ? [
                      {
                        type: "input",
                        props: {
                          class: "edit",
                          value: task.text,
                          onblur: (e) => {
                            const newText = e.target.value.trim();
                            if (newText) {
                              const newTasks = [...tasks];
                              newTasks[realIdx].text = newText;
                              setTasks(newTasks);
                            } else {
                              // Delete if empty
                              const newTasks = tasks.filter((_, i) => i !== realIdx);
                              setTasks(newTasks);
                            }
                            setEditing(null);
                            update();
                          },
                          onkeydown: (e) => {
                            if (e.key === "Enter") {
                              e.target.blur();
                            }
                          }
                        },
                        children: []
                      }
                    ]
                  : [])
              ]
            };
          })
        }
      ]
    }
  ];
}