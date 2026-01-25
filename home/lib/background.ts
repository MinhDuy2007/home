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
export function saveBackground(config: BackgroundConfig): void {
    if (typeof window === "undefined") return;

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
        console.error("Error saving background:", error);
    }
}

/**
 * Load background configuration
 */
export function loadBackground(): BackgroundConfig {
    if (typeof window === "undefined") return DEFAULT_BACKGROUND;

    try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        return item ? JSON.parse(item) : DEFAULT_BACKGROUND;
    } catch (error) {
        console.error("Error loading background:", error);
        return DEFAULT_BACKGROUND;
    }
}

/**
 * Reset background to default
 */
export function resetBackground(): BackgroundConfig {
    saveBackground(DEFAULT_BACKGROUND);
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

    // Recommend size limits
    const sizeMB = file.size / (1024 * 1024);
    if (file.type.startsWith("video/") && sizeMB > 10) {
        return {
            valid: false,
            error: "Video files should be under 10MB for best performance",
        };
    }

    if (file.type.startsWith("image/") && sizeMB > 5) {
        return {
            valid: false,
            error: "Image files should be under 5MB for best performance",
        };
    }

    return { valid: true };
}

/**
 * Process background file and return data URL
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

    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                let type: BackgroundType = "image";
                if (file.type === "image/gif") {
                    type = "gif";
                } else if (file.type.startsWith("video/")) {
                    type = "video";
                }

                const sizeMB = file.size / (1024 * 1024);
                let warning: string | undefined;

                if (sizeMB > 2 && type === "image") {
                    warning = `Image is ${sizeMB.toFixed(1)}MB. Consider compressing for better performance.`;
                } else if (sizeMB > 5 && type === "video") {
                    warning = `Video is ${sizeMB.toFixed(1)}MB. May impact page load speed.`;
                }

                resolve({
                    success: true,
                    data: reader.result,
                    type,
                    warning,
                });
            } else {
                resolve({
                    success: false,
                    error: "Failed to read file",
                });
            }
        };

        reader.onerror = () => {
            resolve({
                success: false,
                error: "Failed to read file. Please try again.",
            });
        };

        reader.readAsDataURL(file);
    });
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
