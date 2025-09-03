export function isSameType(oldNode, newNode) {
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
