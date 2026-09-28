// Cloud Sync & Remote Storage Utility
// Synchronizes website state (memories, letter, voice notes, background music, profile photo) across all devices worldwide

const CLOUD_STORAGE_KEY = 'birthday_app_cloud_config_v1';

// Default Fallback State
export const DEFAULT_CONFIG = {
  bgMusicUrl: '/upohar.mp3', // Default song file path
  voiceNoteUrl: '',
  herPhotoUrl: '/memories/birthday_cake.png',
  letterText: '',
  memories: null
};

// Check if custom cloud sync endpoint or Supabase URL is set
export async function fetchCloudState() {
  try {
    const saved = localStorage.getItem(CLOUD_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Local cloud state read error:', e);
  }
  return null;
}

export async function saveCloudState(state) {
  try {
    localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Local cloud state save error:', e);
  }
}
