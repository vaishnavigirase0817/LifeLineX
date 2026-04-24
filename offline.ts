import { get, set } from 'idb-keyval';
import { useState, useEffect } from 'react';

export const CACHE_KEYS = {
  FACILITIES: 'health_map_facilities',
  OFFLINE_STATUS: 'is_offline',
  RECENT_SEARCHES: 'health_map_recent_searches'
};

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export async function cacheFacilityData(data: any) {
  try {
    await set(CACHE_KEYS.FACILITIES, data);
  } catch (err) {
    console.error('Failed to cache facilities:', err);
  }
}

export async function getCachedFacilityData() {
  try {
    return await get(CACHE_KEYS.FACILITIES);
  } catch (err) {
    console.error('Failed to retrieve cached facilities:', err);
    return null;
  }
}

export async function saveRecentSearch(term: string) {
  if (!term || term.length < 2) return;
  try {
    const existing: string[] = await get(CACHE_KEYS.RECENT_SEARCHES) || [];
    const updated = [term, ...existing.filter(t => t !== term)].slice(0, 5);
    await set(CACHE_KEYS.RECENT_SEARCHES, updated);
    return updated;
  } catch (err) {
    console.error('Failed to save search term:', err);
  }
}

export async function getRecentSearches() {
  try {
    return await get(CACHE_KEYS.RECENT_SEARCHES) || [];
  } catch (err) {
    console.error('Failed to retrieve recent searches:', err);
    return [];
  }
}

export async function clearRecentSearches() {
  try {
    await set(CACHE_KEYS.RECENT_SEARCHES, []);
  } catch (err) {
    console.error('Failed to clear searches:', err);
  }
}
