const key = "game-hub-session";
const eventName = "game-hub-session-change";

export function getPlayerSession() {
  return localStorage.getItem(key);
}

export function savePlayerSession(token: string | null) {
  if (token) localStorage.setItem(key, token);
  else localStorage.removeItem(key);
  window.dispatchEvent(new Event(eventName));
}

export function subscribeToPlayerSession(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(eventName, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(eventName, onChange);
  };
}
