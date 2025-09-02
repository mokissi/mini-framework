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

function diffChildren(parentElement, newChildren, oldChildren) {
  // Handle removals first (from end to start to avoid index issues)
  for (let i = oldChildren.length - 1; i >= newChildren.length; i--) {
    if (parentElement.childNodes[i]) {
      parentElement.removeChild(parentElement.childNodes[i]);
    }
  }
  
  // Handle updates and additions
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    const oldChild = oldChildren[i];
    const childElement = parentElement.childNodes[i];
    
    if (!oldChild) {
      // Add new child
      parentElement.appendChild(createElement(newChild));
    } else if (childElement) {
      if (isSameType(oldChild, newChild)) {
        // Update existing child
        if (typeof newChild === "string") {
          if (newChild !== oldChild) {
            childElement.textContent = newChild;
          }
        } else {
          updateProps(childElement, newChild.props || {}, oldChild.props || {});
          diffChildren(childElement, newChild.children || [], oldChild.children || []);
        }
      } else {
        // Replace child
        parentElement.replaceChild(createElement(newChild), childElement);
      }
    }
  }
}