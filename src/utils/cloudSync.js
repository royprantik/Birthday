// Realtime Cloud Synchronization Utility
// Connects to a dedicated Cloud Database API so any update made on one device instantly syncs to all devices worldwide!

const CLOUD_OBJECT_ID = 'ff808181a09d98f701a0eac168e23a73';
const CLOUD_API_URL = `https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`;
const LOCAL_CACHE_KEY = 'birthday_app_cloud_cache_v5';

// Fetch latest configuration from Cloud Database
export async function fetchCloudState() {
  try {
    const res = await fetch(CLOUD_API_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const result = await res.json();
      if (result && result.data && result.data.memories) {
        // Cache locally for offline resilience
        try {
          localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(result.data));
        } catch (e) {}
        return result.data;
      }
    }
  } catch (err) {
    console.warn('Cloud database fetch error, using local fallback:', err);
  }

  // Fallback to local cache if network is offline
  try {
    const cached = localStorage.getItem(LOCAL_CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  return null;
}

// Push updated configuration to Cloud Database
export async function saveCloudState(state) {
  // Update local cache immediately
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(state));
  } catch (e) {}

  // Sync to Cloud Database REST API
  try {
    const payload = {
      name: 'Birthday Memory Crush Site Config',
      data: state
    };

    const res = await fetch(CLOUD_API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log('✅ Successfully synced configuration to Cloud Database across all devices!');
      return true;
    }
  } catch (err) {
    console.warn('Cloud database sync error:', err);
  }

  return false;
}
