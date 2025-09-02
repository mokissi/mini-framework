let currentVDOM = null;
let rootElement = null;

export function createElement(vnode) {
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

function isSameType(oldNode, newNode) {
  if (typeof oldNode !== typeof newNode) return false;
  if (typeof oldNode === "string") return true;
  return oldNode.type === newNode.type;
}


export function updateProps(element, newProps, oldProps) {
  const allProps = { ...oldProps, ...newProps };
  
  for (const key in allProps) {
    const newValue = newProps[key];
    const oldValue = oldProps[key];
    
    if (key === "key") continue;
    if (key.startsWith("on")) {
     
      element[key.toLowerCase()] = newValue || null;
    } else if (key === "class") {
      element.className = newValue || "";
    } else if (key === "id") {
      element.id = newValue || "";
    } else if (key === "value") {
      if (element === document.activeElement && element.value !== newValue) {
        const start = element.selectionStart;
        const end = element.selectionEnd;
        element.value = newValue || "";
        element.setSelectionRange(start, end);
      } else if (element !== document.activeElement) {
        
        element.value = "";
      }


    } else if (key in element) {
      element[key] = newValue;
    } else {
      if (newValue != null && newValue !== false) {
        element.setAttribute(key, newValue === true ? "" : newValue);
      } else if (oldValue != null) {
        element.removeAttribute(key);
      }
    }
  }
}

export function diffChildren(parentElement, newChildren, oldChildren) {
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