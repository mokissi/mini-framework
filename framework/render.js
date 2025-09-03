
import { createElement, updateProps, diffChildren, isSameType } from "./dff.js";

let currentVDOM = null;
let rootElement = null;



export function renderApp(component, appContainer) {
  const newVDOM = component();

  // Support array of root nodes
  if (Array.isArray(newVDOM)) {
    // Always clear and append all children for array roots
    appContainer.innerHTML = "";
    rootElement = [];
    newVDOM.forEach((vnode) => {
      const el = createElement(vnode);
      appContainer.appendChild(el);
      rootElement.push(el);
    });
    currentVDOM = newVDOM;
    return;
  }

  if (!currentVDOM || !rootElement) {
    // First render
    // appContainer.innerHTML = "";
    rootElement = createElement(newVDOM);
    appContainer.appendChild(rootElement);
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
