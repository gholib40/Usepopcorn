import { useEffect, useState } from "react";

export function useLocalStorageState(initialstate, key) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem("watched");
    return storedValue ? JSON.parse(storedValue) : initialstate;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);
  return [value, setValue];
}
