/**
 * App Launch Preferences
 * 
 * Manages "remember my choice" preferences for app protocol launches
 */

const STORAGE_KEY = "app_launch_preferences";

interface AppPreferences {
    [appId: string]: {
        autoLaunch: boolean;
        timestamp: number;
    };
}

/**
 * Load all app preferences
 */
function loadPreferences(): AppPreferences {
    if (typeof window === "undefined") return {};

    try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        return item ? JSON.parse(item) : {};
    } catch (error) {
        console.error("Error loading app preferences:", error);
        return {};
    }
}

/**
 * Save all app preferences
 */
function savePreferences(preferences: AppPreferences): void {
    if (typeof window === "undefined") return;

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
        console.error("Error saving app preferences:", error);
    }
}

/**
 * Check if user has set auto-launch preference for an app
 */
export function shouldAutoLaunchApp(appId: string): boolean {
    const preferences = loadPreferences();
    const pref = preferences[appId];

    return pref?.autoLaunch === true;
}

/**
 * Set auto-launch preference for an app
 */
export function setAppAutoLaunch(appId: string, autoLaunch: boolean): void {
    const preferences = loadPreferences();

    preferences[appId] = {
        autoLaunch,
        timestamp: Date.now(),
    };

    savePreferences(preferences);
}

/**
 * Clear preference for a specific app
 */
export function clearAppPreference(appId: string): void {
    const preferences = loadPreferences();
    delete preferences[appId];
    savePreferences(preferences);
}

/**
 * Clear all app preferences
 */
export function clearAllAppPreferences(): void {
    if (typeof window === "undefined") return;

    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("Error clearing app preferences:", error);
    }
}
