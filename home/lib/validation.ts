/**
 * Input Validation Utilities
 * 
 * Provides validation functions for URLs, file uploads, and form inputs
 */

/**
 * Validate standard web URL
 */
export function isValidUrl(url: string): boolean {
    if (!url || typeof url !== "string") return false;

    try {
        const urlObj = new URL(url);
        return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
        return false;
    }
}

/**
 * Validate protocol URL (for app links like discord://)
 */
export function isValidProtocolUrl(url: string): boolean {
    if (!url || typeof url !== "string") return false;

    // Protocol URLs should have format: protocol://...
    const protocolRegex = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/.*/;
    return protocolRegex.test(url);
}

/**
 * Validate title is non-empty
 */
export function isValidTitle(title: string): boolean {
    return typeof title === "string" && title.trim().length > 0;
}

/**
 * Validate file type and size
 */
export function isValidFile(
    file: File,
    allowedTypes: string[],
    maxSizeMB?: number
): { valid: boolean; error?: string } {
    // Check type
    const fileType = file.type;
    const extension = file.name.split(".").pop()?.toLowerCase();

    const isTypeAllowed = allowedTypes.some((type) => {
        if (type.startsWith(".")) {
            return extension === type.substring(1);
        }
        return fileType.startsWith(type);
    });

    if (!isTypeAllowed) {
        return {
            valid: false,
            error: `File type not allowed. Accepted: ${allowedTypes.join(", ")}`,
        };
    }

    // Check size
    if (maxSizeMB) {
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
            return {
                valid: false,
                error: `File too large. Maximum size: ${maxSizeMB}MB`,
            };
        }
    }

    return { valid: true };
}

/**
 * Get file size warning if file is large
 */
export function getFileSizeWarning(file: File): string | null {
    const sizeMB = file.size / (1024 * 1024);

    if (file.type.startsWith("video/") && sizeMB > 5) {
        return `Video is ${sizeMB.toFixed(1)}MB. Large videos may slow down your dashboard. Consider compressing to under 5MB.`;
    }

    if (file.type.startsWith("image/") && sizeMB > 2) {
        return `Image is ${sizeMB.toFixed(1)}MB. Large images may slow down your dashboard. Consider resizing to under 2MB.`;
    }

    return null;
}

/**
 * Convert file to base64 data URL
 */
export function fileToDataURL(file: File): Promise<string> {
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
 * Validate and process uploaded file
 */
export async function processUploadedFile(
    file: File,
    allowedTypes: string[],
    maxSizeMB?: number
): Promise<{ success: boolean; data?: string; error?: string; warning?: string }> {
    const validation = isValidFile(file, allowedTypes, maxSizeMB);

    if (!validation.valid) {
        return { success: false, error: validation.error };
    }

    try {
        const dataURL = await fileToDataURL(file);
        const warning = getFileSizeWarning(file);

        return {
            success: true,
            data: dataURL,
            warning: warning || undefined,
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to process file. Please try again.",
        };
    }
}
