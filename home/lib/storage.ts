/**
 * LocalStorage Utility Functions
 * 
 * Provides type-safe localStorage operations for persisting user data.
 * All data persists across page refreshes and browser sessions.
 */

import { Shortcut, Profile, DEFAULT_SHORTCUTS, DEFAULT_PROFILE } from "./shortcuts";

/**
 * Storage Keys
 */
const STORAGE_KEYS = {
    SHORTCUTS: "dashboard_shortcuts",
    PROFILE: "dashboard_profile",
    FOCUS_MODE: "dashboard_focus_mode",
    THEME: "dashboard_theme",
} as const;

/**
 * Type-safe localStorage getter
 */
function getFromStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue;

    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage (${key}):`, error);
        return defaultValue;
    }
}

/**
 * Type-safe localStorage setter
 */
function setToStorage<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;

    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage (${key}):`, error);
    }
}

/**
 * Shortcuts Management
 */
export function saveShortcuts(shortcuts: Shortcut[]): void {
    setToStorage(STORAGE_KEYS.SHORTCUTS, shortcuts);
}

export function loadShortcuts(): Shortcut[] {
    return getFromStorage<Shortcut[]>(STORAGE_KEYS.SHORTCUTS, DEFAULT_SHORTCUTS);
}

export function resetShortcuts(): Shortcut[] {
    setToStorage(STORAGE_KEYS.SHORTCUTS, DEFAULT_SHORTCUTS);
    return DEFAULT_SHORTCUTS;
}

/**
 * Profile Management
 */
export function saveProfile(profile: Profile): void {
    setToStorage(STORAGE_KEYS.PROFILE, profile);
}

export function loadProfile(): Profile {
    if (typeof window === "undefined") return DEFAULT_PROFILE;

    try {
        const item = window.localStorage.getItem(STORAGE_KEYS.PROFILE);
        if (!item) return DEFAULT_PROFILE;

        const stored = JSON.parse(item);

        // Migration: Handle old format with avatarUrl instead of avatar object
        if (stored.avatarUrl && !stored.avatar) {
            const migratedProfile: Profile = {
                name: stored.name || DEFAULT_PROFILE.name,
                bio: stored.bio || DEFAULT_PROFILE.bio,
                avatar: {
                    mode: "url",
                    url: stored.avatarUrl,
                    mediaType: "image",
                },
            };
            // Save migrated profile
            saveProfile(migratedProfile);
            return migratedProfile;
        }

        return stored as Profile;
    } catch (error) {
        console.error("Error loading profile:", error);
        return DEFAULT_PROFILE;
    }
}


export function resetProfile(): Profile {
    setToStorage(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
}

/**
 * Focus Mode Management
 */
export function saveFocusMode(enabled: boolean): void {
    setToStorage(STORAGE_KEYS.FOCUS_MODE, enabled);
}

export function loadFocusMode(): boolean {
    return getFromStorage<boolean>(STORAGE_KEYS.FOCUS_MODE, false);
}

/**
 * Export All User Data
 * Returns a JSON string of all user data for backup/transfer
 */
export function exportData(): string {
    const data = {
        shortcuts: loadShortcuts(),
        profile: loadProfile(),
        focusMode: loadFocusMode(),
        exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
}

/**
 * Import User Data
 * Validates and imports data from JSON string
 * Returns true if import was successful
 */
export function importData(jsonString: string): boolean {
    try {
        const data = JSON.parse(jsonString);

        // Validate data structure
        if (!data || typeof data !== "object") {
            throw new Error("Invalid data format");
        }

        // Import shortcuts if valid
        if (Array.isArray(data.shortcuts)) {
            saveShortcuts(data.shortcuts);
        }

        // Import profile if valid
        if (data.profile && typeof data.profile === "object") {
            saveProfile(data.profile);
        }

        // Import focus mode if valid
        if (typeof data.focusMode === "boolean") {
            saveFocusMode(data.focusMode);
        }

        return true;
    } catch (error) {
        console.error("Error importing data:", error);
        return false;
    }
}

/**
 * Reset All Data to Defaults
 */
export function resetAllData(): void {
    resetShortcuts();
    resetProfile();
    saveFocusMode(false);
}

/**
 * Download data as JSON file
 */
export function downloadExport(): void {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dashboard-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
