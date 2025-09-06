/**
 * Browser Environment Utilities for Next.js SSR Safety
 *
 * COMMON USE CASES WHERE THIS IS NEEDED:
 *
 * 1. 🌐 Browser APIs Access:
 *    - window.location, window.history
 *    - document.title, document.getElementById
 *    - navigator.geolocation, navigator.clipboard
 *
 * 2. 📱 Device Features:
 *    - Device orientation (compass functionality)
 *    - Geolocation (GPS tracking)
 *    - Camera/media access
 *
 * 3. 🎯 Event Listeners:
 *    - window.addEventListener (resize, scroll, popstate)
 *    - document.addEventListener (click, keydown)
 *    - Browser back button detection
 *
 * 4. 💾 Storage APIs:
 *    - localStorage.setItem/getItem
 *    - sessionStorage operations
 *    - IndexedDB access
 *
 * 5. ⏰ Timers:
 *    - setTimeout, setInterval
 *    - requestAnimationFrame
 *
 * 6. 🔄 Real-time Features:
 *    - WebSocket connections
 *    - SSE (Server-Sent Events)
 *    - Push notifications
 */

// Functions for browser environment checks (dynamic evaluation)
export const isWindow = (): boolean => typeof window !== 'undefined'
export const hasDocument = (): boolean => typeof document !== 'undefined'
export const hasNavigator = (): boolean => typeof navigator !== 'undefined'
export const canUseBrowser = (): boolean => isWindow() && hasDocument()

/**
 * Execute callback only if in browser environment
 * @param callback Function to execute
 * @param fallback Optional fallback value
 */
export const ifBrowser = <T>(callback: () => T, fallback?: T): T | undefined => {
  return canUseBrowser() ? callback() : fallback
}

/**
 * Safe history.pushState for back button detection
 * Common pattern in navigation components
 */
export const safePushState = (state: any = null, title?: string, url?: string): void => {
  if (canUseBrowser()) {
    const safeTitle = title || document.title
    const safeUrl = url || window.location.href
    window.history.pushState(state, safeTitle, safeUrl)
  }
}
