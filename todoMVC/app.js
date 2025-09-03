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
  const appContainer = document.body;
  renderApp(App, appContainer);
}

// Header component - handles the title and new todo input
export function renderHeader() {
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

// Main section component - handles the todo list and toggle all functionality
function renderMainSection(tasks, visibleTasks, editing, filter) {
  return {
    type: "main",
    props: { class: "main", "data-testid": "main" },
    children: [
      ...(tasks.length > 0 ? [
            {
              type: "div",
              props: { class: "toggle-all-container" },
              children: [
                {
                  type: "input",
                  props: {
                    class: "toggle-all",
                    type: "checkbox",
                    id: "toggle-all",
                    "data-testid": "toggle-all",
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
                  props: { class:"toggle-all-label",  for: "toggle-all" },
                  children: ["Mark all as complete"]
                }
              ]
            }
          ] : []),
      // Always render the ul element, even when empty
      {
        type: "ul",
        props: { class: "todo-list", "data-testid": "todo-list" },
        children: tasks.length === 0 ? [] : [
          // Toggle all checkbox and label (only show when there are tasks)
          
          // Actual todo items
          ...visibleTasks.map((task, idx) => {
            const realIdx = tasks.indexOf(task);

            return {
              type: "li",
              props: {
                key: task.id,
                class: [
                  task.completed ? "completed" : "",
                  editing === realIdx ? "editing" : ""
                ].filter(Boolean).join(" "),
                "data-testid": "todo-item"
              },
              children: [
                {
                  type: "div",
                  props: { class: "view" },
                  children: [
                    {
                      type: "input",
                      props: {
                        // id: realIdx,
                        class: "toggle",
                        type: "checkbox",
                        "data-testid": "todo-item-toggle",
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
                        "data-testid": "todo-item-label",
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
                        "data-testid": "todo-item-button",
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
        ]
      }
    ]
  };
}

// Footer component - handles filters, item count, and clear completed button
function renderFooter(remaining, filter, tasks) {
  return {
    type: "footer",
    props: { class: "footer" , "data-testid": "footer"},
    children: [
      {
        type: "span",
        props: { class: "todo-count" },
        children: [
          `${remaining} item${remaining !== 1 ? "s" : ""} left`
        ]
      },
      {
        type: "ul",
        props: { class: "filters" , "data-testid": "footer-navigation"},
        children: [
          {
            type: "li",
            children: [
              {
                type: "a",
                props: {
                  class: filter === "all" ? "selected" : "",
                  href: "#/",
                  onclick: (e) => {
                    e.preventDefault();
                    navigate("/");
                  }
                },
                children: ["All"]
              }
            ]
          },
          {
            type: "li",
            children: [
              {
                type: "a",
                props: {
                  class: filter === "active" ? "selected" : "",
                  href: "#/active",
                  onclick: (e) => {
                    e.preventDefault();
                    navigate("/active");
                  }
                },
                children: ["Active"]
              }
            ]
          },
          {
            type: "li",
            children: [
              {
                type: "a",
                props: {
                  class: filter === "completed" ? "selected" : "",
                  href: "#/completed",
                  onclick: (e) => {
                    e.preventDefault();
                    navigate("/completed");
                  }
                },
                children: ["Completed"]
              }
            ]
          }
        ]
      },
      {
        type: "button",
        props: {
          class: "clear-completed",
          disabled: tasks.every((t) => !t.completed),
          onclick: () => {
            setTasks(tasks.filter((t) => !t.completed));
            update();
          }
        },
        children: ["Clear completed"]
      }
    ]
  };
}

// Main App function - now much cleaner and focused on coordination
function App() {
  // --- Sync filter with route ---
  const route = useRoute();
  let filter = getFilter();

  // Update filter based on route
  let newFilter = "all";
  if (route === "/active") newFilter = "active";
  if (route === "/completed") newFilter = "completed";

  if (filter !== newFilter) {
    setFilter(newFilter);
    filter = newFilter;
  }

  const tasks = getTasks();
  const editing = getEditing();

  setInput(getInput());

  // Filter tasks
  const visibleTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const remaining = tasks.filter((t) => !t.completed).length;

  return {
    type: "section",
    props: { class: "todoapp", id: "root" },
    children: [
      renderHeader(),
      renderMainSection(tasks, visibleTasks, editing, filter),
      ...(tasks.length > 0 ? [renderFooter(remaining, filter, tasks)] : [])
    ]
  };
}

// Initialize app
const appContainer = document.body;
initRouter();
onRouteChange(() => renderApp(App, appContainer));
renderApp(App, appContainer);

