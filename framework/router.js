let previousHash = window.location.hash;
let currentRoute = previousHash.slice(1) || "/";
let listeners = [];


export function useRoute() {
  return currentRoute;
}

export function onRouteChange(listener) {
  listeners.push(listener);
}

export function navigate(path) {
  if (path !== currentRoute) {
    window.location.hash = path;
    currentRoute = path;
    listeners.forEach((fn) => fn(currentRoute));
  }
}

export function initRouter() {
  setInterval(() => {
    const newHash = window.location.hash;
    if (newHash !== previousHash) {
      previousHash = newHash;
      currentRoute = newHash.slice(1) || "/";
      listeners.forEach((fn) => fn(currentRoute));
    }
  }, 100);
}