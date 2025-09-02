import { renderHeader } from "../todoMVC/app.js";
import { createElement, updateProps, diffChildren, isSameType } from "./dff.js";
let currentVDOM = null;
let rootElement = null;
export function renderApp(component, appContainer) {
  let newVDOM = component();
  // let newVDOM = renderHeader();
  // console.log("-------", renderHeader());
  // console.log("2222222222", component());

  if (!currentVDOM || !rootElement) {
    // First render
    appContainer.innerHTML = "";
    const header = createElement(renderHeader())
    rootElement = createElement(newVDOM);
    appContainer.append(header, rootElement);
  } else {
    // Diff and update
    if (isSameType(currentVDOM, newVDOM)) {
      updateProps(rootElement, newVDOM.props || {}, currentVDOM.props || {});
      diffChildren(rootElement, newVDOM.children || [], currentVDOM.children || []);
    } else {
      // Replace entire root
      const newRoot = createElement(newVDOM);
      appContainer.replaceChild(newRoot, rootElement);
      rootElement = newRoot;
    }
  }

  currentVDOM = newVDOM;
}
