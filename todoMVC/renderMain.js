import { setTasks, getTasks } from "./renderHeader.js";
import { update } from "./renderHeader.js";
import {setEditing} from "./app.js";
// Main section component - handles the todo list and toggle all functionality
export function renderMainSection(tasks, visibleTasks, editing, filter) {
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
              props: { class: "toggle-all-label", for: "toggle-all" },
              children: ["Toggle All Input"]
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