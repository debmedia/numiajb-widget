import { SESSION_ID_STORAGE_KEY } from "../constants";

// SET THE SESSION IN LOCAL STORAGE
export function setSessionInLocalStorage(value: string) {
  localStorage.setItem(SESSION_ID_STORAGE_KEY, value);
}

// GET THE SESSION FROM LOCAL STORAGE IF EXISTS
export function getSession() {
  return (localStorage.getItem(SESSION_ID_STORAGE_KEY) || null);
}

// REMOVE SESSION FROM LOCAL STORAGE
export function removeSession() {
	localStorage.removeItem(SESSION_ID_STORAGE_KEY);
}
