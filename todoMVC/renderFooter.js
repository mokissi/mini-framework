import { navigate } from "../framework/router.js";
import { setTasks } from "./renderHeader.js";
import { update } from "./renderHeader.js";

// Footer component - handles filters, item count, and clear completed button
export function renderFooter(remaining, filter, tasks) {
  return {
    type: "footer",
    props: { class: "footer", "data-testid": "footer" },
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
        props: { class: "filters", "data-testid": "footer-navigation" },
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

// Info Footer component - static info at the bottom
export function renderInfoFooter() {
  return {
    type: "footer",
    props: { class: "footer" },
    children: [
      {
        type: "p",
        props: {},
        children: ["Double-click to edit a todo"]
      },
      {
        type: "p",
        props: {},
        children: ["Created by the Mboutaba's team"]
      },
      {
        type: "p",
        props: {},
        children: [
          "Similar to ",
          {
            type: "a",
            props: { href: "http://todomvc.com" },
            children: ["TodoMVC"]
          }
        ]
      }
    ]
  };
}