const API_KEY = 'Treasurer';
const BIN_ID = '$2a$10$insh9mfEdNT5CqQCLNX/xeFruMAgC62ncK2Nvgpi01t6TotlBUukq';
const API_URL = `https://api.jsonbin.io/v3/b/${$2a$10$insh9mfEdNT5CqQCLNX/xeFruMAgC62ncK2Nvgpi01t6TotlBUukq}`;

async function getSharedData() {
  const res = await fetch(API_URL, {
    headers: { 'X-Master-Key': API_KEY }
  });
  const json = await res.json();
  return json.record;
}

async function updateSharedData(newData) {
  const res = await fetch(API_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY,
    },
    body: JSON.stringify(newData)
  });
  return await res.json();
}

// Convert localStorage to an object
function getLocalStorageData() {
  let data = {};
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    data[key] = localStorage.getItem(key);
  }
  return data;
}

// Merge two objects — localStorage overrides shared data
function mergeData(sharedData, localData) {
  return { ...sharedData, ...localData };
}

// Update localStorage from an object
function updateLocalStorage(data) {
  localStorage.clear();
  for (let key in data) {
    localStorage.setItem(key, data[key]);
  }
}

(async () => {
  try {
    const sharedData = await getSharedData();
    const localData = getLocalStorageData();

    // Merge shared data and local data (local wins)
    const merged = mergeData(sharedData || {}, localData);

    // Update the shared bin with merged data
    await updateSharedData(merged);

    // Update user's localStorage with the merged shared data
    updateLocalStorage(merged);

    console.log('LocalStorage synced with shared storage:', merged);
  } catch (e) {
    console.error('Error syncing localStorage:', e);
  }
})();
