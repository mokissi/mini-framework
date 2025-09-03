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