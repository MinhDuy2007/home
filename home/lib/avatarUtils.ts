/**
 * Avatar Utilities
 * 
 * Helper functions for avatar file processing, validation, and media type detection
 */

/**
 * Avatar configuration stored in profile
 */
export interface AvatarConfig {
    mode: "url" | "file";
    url?: string;
    fileDataUrl?: string;
    mediaType: "image" | "gif" | "video";
}

/**
 * Convert File to Data URL (base64) for storage
 */
export async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                reject(new Error("Failed to read file"));
            }
        };

        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Detect media type from file
 */
export function detectMediaTypeFromFile(file: File): "image" | "gif" | "video" {
    if (file.type === "image/gif") {
        return "gif";
    }
    if (file.type.startsWith("video/")) {
        return "video";
    }
    return "image";
}

/**
 * Detect media type from URL
 */
export function detectMediaTypeFromUrl(url: string): "image" | "gif" | "video" {
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.endsWith(".gif")) {
        return "gif";
    }
    if (lowerUrl.endsWith(".mp4") || lowerUrl.endsWith(".webm")) {
        return "video";
    }
    return "image";
}

/**
 * Validate avatar file
 */
export function validateAvatarFile(file: File): { valid: boolean; error?: string } {
    const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
        "video/mp4",
        "video/webm",
    ];

    if (!validTypes.includes(file.type)) {
        return {
            valid: false,
            error: "Invalid file type. Accepted: JPG, PNG, WebP, GIF, MP4, WebM",
        };
    }

    // Check file size (max 10MB for videos, 5MB for images)
    const maxSize = file.type.startsWith("video/") ? 10 : 5;
    const sizeMB = file.size / (1024 * 1024);

    if (sizeMB > maxSize) {
        return {
            valid: false,
            error: `File too large. Maximum: ${maxSize}MB`,
        };
    }

    return { valid: true };
}

/**
 * Validate avatar URL
 */
export function validateAvatarUrl(url: string): { valid: boolean; error?: string } {
    if (!url || typeof url !== "string") {
        return { valid: false, error: "URL is required" };
    }

    try {
        const urlObj = new URL(url);
        if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
            return { valid: false, error: "URL must use http:// or https://" };
        }
        return { valid: true };
    } catch {
        return { valid: false, error: "Invalid URL format" };
    }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

/**
 * Get default avatar config
 */
export function getDefaultAvatar(): AvatarConfig {
    return {
        mode: "url",
        url: "/avatar.png",
        mediaType: "image",
    };
}
