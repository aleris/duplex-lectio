import { Dispatch, SetStateAction, useCallback, useEffect, useSyncExternalStore } from 'react'

function dispatchStorageEvent(key: string, newValue: string | null | undefined) {
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
}

function setLocalStorageItem<T>(key: string, value: T) {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
};

const removeLocalStorageItem = (key: string) => {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
};

const getLocalStorageItem = (key: string) => {
  return window.localStorage.getItem(key);
};

const useLocalStorageSubscribe = (callback: EventListenerOrEventListenerObject) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getLocalStorageServerSnapshot = () => {
  throw Error("useLocalStorage is a client-only hook");
};

export function useLocalStorage<T>(key: string, initialValue: T | undefined = undefined): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
  const getSnapshot = () => getLocalStorageItem(key);

  const store = useSyncExternalStore(
    useLocalStorageSubscribe,
    getSnapshot,
    getLocalStorageServerSnapshot
  );

  const setState: Dispatch<SetStateAction<T | undefined>> = useCallback(
    (v) => {
      try {
        const nextState = v instanceof Function
          ? (store == null ? null : v(JSON.parse(store)))
          : v;

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key);
        } else {
          setLocalStorageItem(key, nextState);
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [key, store]
  );

  useEffect(() => {
    if (
      getLocalStorageItem(key) === null &&
      typeof initialValue !== "undefined"
    ) {
      setLocalStorageItem(key, initialValue);
    }
  }, [key, initialValue]);

  return [store ? JSON.parse(store) : initialValue, setState];
}
