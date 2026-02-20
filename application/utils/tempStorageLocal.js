// utils/tempStorage.ts

export function setWithExpiry(key, value, ttlMs) {
  const now = Date.now();

  const item = {
    value,
    expiry: now + ttlMs,
  };

  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    const now = Date.now();

    if (now > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function removeItem(key) {
  localStorage.removeItem(key);
}