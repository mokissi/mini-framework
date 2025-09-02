let currentVDOM = null;
let rootElement = null;

function createElement(vnode) {
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  const el = document.createElement(vnode.type);

  // Apply props
  for (const [key, value] of Object.entries(vnode.props || {})) {
    if (key === "key") continue;
    
    if (key.startsWith("on")) {
     
     
     el[key.toLowerCase()] = value;
    } else if (key === "class") {
      el.className = value || "";
    } else if (key === "id") {
      el.id = value || "";
    } else if (key in el) {
      el[key] = value;
    } else {
      if (value != null && value !== false) {
        el.setAttribute(key, value === true ? "" : value);
      }
    }
  }

  // Children
  (vnode.children || []).forEach((child) => {
    el.appendChild(createElement(child));
  });

  return el;
}