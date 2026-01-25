import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Handle app protocol links with fallback
 * Attempts to open a desktop app via protocol link (e.g., discord://)
 * Falls back to web URL if the app is not installed
 * 
 * @param protocolUrl - The protocol URL (e.g., "discord://")
 * @param fallbackUrl - The web URL to use if app is not installed
 */
export function handleAppProtocolLink(
  protocolUrl: string,
  fallbackUrl?: string
): void {
  // Create a hidden iframe to attempt the protocol link
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  // Try to open the app via protocol
  if (iframe.contentWindow) {
    iframe.contentWindow.location.href = protocolUrl;
  }

  // Set a timeout to fallback if app doesn't open
  // If the app opens successfully, the user is switched away from the browser
  // If it fails, we fallback to the web URL after a brief delay
  setTimeout(() => {
    document.body.removeChild(iframe);

    // If fallback URL is provided, open it
    if (fallbackUrl) {
      window.open(fallbackUrl, "_blank");
    }
  }, 1000);
}
