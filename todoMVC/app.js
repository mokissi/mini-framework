import { useRoute, onRouteChange, initRouter } from "../framework/router.js";
import { useState } from "../framework/state.js";
import { renderApp } from "../framework/render.js";
import { getTasks, getInput, setInput, renderHeader } from "./renderHeader.js";
import { renderMainSection } from "./renderMain.js";
import { renderFooter, renderInfoFooter } from "./renderFooter.js";


const [getFilter, setFilter] = useState("filter", "all");
export const [getEditing, setEditing] = useState("editing", null);


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
      ...(tasks.length > 0 ? [renderFooter(remaining, filter, tasks)] : []),
    ]
  };
}

// Initialize app
const appContainer = document.body;
export function Root() {
  return [App(), renderInfoFooter()];
}
initRouter();
onRouteChange(() => renderApp(Root, appContainer));
renderApp(Root, appContainer);

