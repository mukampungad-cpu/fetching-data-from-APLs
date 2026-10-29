//

import { fetchData } from "../api.js";

export function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

async function getData() {
  try {
    const data = await fetchData();
    if (!data) {
      console.error("No data fetched.");
      return;
    }

    saveToLocalStorage("products", data);

    return data;
  } catch (error) {
    console.error("Failed to save to local storage");
  }
}

getData();