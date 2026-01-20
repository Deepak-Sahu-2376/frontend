import { API_BASE_URL } from "./apiClient";

/**
 * Generates a full URL for an image path.
 * Handles:
 * - Null/Undefined paths
 * - Absolute URLs (http/https/blob)
 * - Relative paths (with or without leading slash)
 * - Backslash normalization (windows paths)
 * 
 * @param {string} path - The image path from the backend or other source.
 * @returns {string|null} - The full URL or null if invalid.
 */
export const getImageUrl = (path) => {
    if (!path) return null;

    // Check if it's already an absolute URL or a blob URL
    if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) {
        return path;
    }

    // Normalize backslashes to forward slashes
    let cleanPath = path.replace(/\\/g, '/');

    // Remove leading slash if present to avoid double slashes when joining
    if (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.substring(1);
    }

    // Determine base URL (ensure no trailing slash on API_BASE_URL if we were concatenating, 
    // but here we stripped the leading slash from path, so we need one separator)
    // API_BASE_URL typically does NOT end with a slash based on standard convention, 
    // but let's be safe.

    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;

    return `${baseUrl}${cleanPath}`;
};
