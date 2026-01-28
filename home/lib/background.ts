/**
 * Background Configuration Utilities
 * 
 * Provides types and functions for managing customizable backgrounds
 */

export type BackgroundType = "none" | "color" | "gradient" | "image" | "gif" | "video";

export interface BackgroundConfig {
    type: BackgroundType;
    value: string; // color code, base64 data URL, or gradient CSS
    blur: number; // 0-10
    dim: number; // 0-100 (opacity percentage)
}

/**
 * Storage Keys
 */
const STORAGE_KEY = "dashboard_background";

/**
 * Default background configuration
 */
export const DEFAULT_BACKGROUND: BackgroundConfig = {
    type: "none",
    value: "",
    blur: 0,
    dim: 0,
};

/**
 * Save background configuration
 */
/**
 * Save background configuration
 */
export async function saveBackground(config: BackgroundConfig): Promise<void> {
    if (typeof window === "undefined") return;

    try {
        // If it's a blob url (video/large image), we need to prevent it from being lost
        // We can't store blob URLs directly in localStorage as they expire
        // So we store the blob data in IndexedDB
        if (config.value.startsWith("blob:")) {
            try {
                const response = await fetch(config.value);
                const blob = await response.blob();

                // Store the blob in IDB
                const { setItem } = await import("./db");
                await setItem("background_blob", blob);

                // Store metadata in localStorage (or IDB), but mark value as stored
                const configToStore = { ...config, value: "blob:stored" };

                // Also store config in IDB to be safe/consistent
                await setItem(STORAGE_KEY, configToStore);

                // Keep localStorage for non-blob fallbacks or legacy checks, 
                // but IDB is now primary for backgrounds
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(configToStore));
            } catch (err) {
                console.error("Failed to store blob:", err);
            }
        } else {
            // Normal storage for colors/gradients
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
            // Also update IDB for consistency
            const { setItem } = await import("./db");
            await setItem(STORAGE_KEY, config);
            // Clear any old blob if we switched to color/gradient
            const { deleteItem } = await import("./db");
            await deleteItem("background_blob");
        }
    } catch (error) {
        console.error("Error saving background:", error);
    }
}

/**
 * Load background configuration
 */
export async function loadBackground(): Promise<BackgroundConfig> {
    if (typeof window === "undefined") return DEFAULT_BACKGROUND;

    try {
        // Try IDB first for full data
        const { getItem } = await import("./db");
        const storedConfig = await getItem<BackgroundConfig>(STORAGE_KEY);

        let config = storedConfig;

        // Fallback to localStorage if IDB empty (migration)
        if (!config) {
            const item = window.localStorage.getItem(STORAGE_KEY);
            if (item) config = JSON.parse(item);
        }

        if (!config) return DEFAULT_BACKGROUND;

        // Restore blob if needed
        if (config.value === "blob:stored") {
            const blob = await getItem<Blob>("background_blob");
            if (blob) {
                const url = URL.createObjectURL(blob);
                return { ...config, value: url };
            } else {
                return DEFAULT_BACKGROUND; // Lost source
            }
        }

        return config;
    } catch (error) {
        console.error("Error loading background:", error);
        return DEFAULT_BACKGROUND;
    }
}

/**
 * Reset background to default
 */
export async function resetBackground(): Promise<BackgroundConfig> {
    await saveBackground(DEFAULT_BACKGROUND);
    return DEFAULT_BACKGROUND;
}

/**
 * Validate background file
 */
export function validateBackgroundFile(file: File): { valid: boolean; error?: string } {
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const validVideoTypes = ["video/mp4", "video/webm"];
    const allValidTypes = [...validImageTypes, ...validVideoTypes];

    if (!allValidTypes.includes(file.type)) {
        return {
            valid: false,
            error: "Invalid file type. Accepted: JPG, PNG, GIF, WebP, MP4, WebM",
        };
    }

    // Recommend size limits (relaxed for IDB)
    const sizeMB = file.size / (1024 * 1024);
    if (file.type.startsWith("video/") && sizeMB > 100) {
        return {
            valid: false,
            error: "Video files should be under 100MB",
        };
    }

    if (file.type.startsWith("image/") && sizeMB > 20) {
        return {
            valid: false,
            error: "Image files should be under 20MB",
        };
    }

    return { valid: true };
}

/**
 * Process background file and return object URL
 */
export async function processBackgroundFile(file: File): Promise<{
    success: boolean;
    data?: string;
    type?: BackgroundType;
    error?: string;
    warning?: string;
}> {
    const validation = validateBackgroundFile(file);
    if (!validation.valid) {
        return { success: false, error: validation.error };
    }

    let type: BackgroundType = "image";
    if (file.type === "image/gif") {
        type = "gif";
    } else if (file.type.startsWith("video/")) {
        type = "video";
    }

    // Use Object URL for instant preview and better performance
    // The previous FileReader approach used base64 which exploded memory usage
    const objectUrl = URL.createObjectURL(file);

    const sizeMB = file.size / (1024 * 1024);
    let warning: string | undefined;

    if (sizeMB > 5 && type === "image") {
        warning = `Large image (${sizeMB.toFixed(1)}MB).`;
    } else if (sizeMB > 20 && type === "video") {
        warning = `Large video (${sizeMB.toFixed(1)}MB).`;
    }

    return {
        success: true,
        data: objectUrl,
        type,
        warning,
    };
}

/**
 * Predefined gradient presets
 */
export const GRADIENT_PRESETS = [
    {
        name: "Sunset",
        value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
        name: "Ocean",
        value: "linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)",
    },
    {
        name: "Forest",
        value: "linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)",
    },
    {
        name: "Fire",
        value: "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)",
    },
    {
        name: "Aurora",
        value: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
    },
    {
        name: "Violet",
        value: "linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)",
    },
];
